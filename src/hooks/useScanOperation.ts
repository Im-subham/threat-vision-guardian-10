import { useState } from 'react';
import { toast } from 'sonner';
import { scanFileWithVirusTotal, scanUrlWithVirusTotal } from '@/components/scanner/VirusTotalService';
import { ScanEngine } from '@/components/scanner/ScanOptions';
import { ScanResultData } from '@/components/scanner/types';

export const useScanOperation = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [scanEngine, setScanEngine] = useState<ScanEngine>('both');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState<ScanResultData | null>(null);
  const [apiKey] = useState<string>('acd8effa2bc8f813048fd93ed6eed9ea7d7e33d6b765aaf9d0401d8f7707142b');

  const handleStartScan = async () => {
    if (!selectedFile && !selectedUrl) {
      toast.error('No file or URL selected', {
        description: 'Please select a file or enter a URL to scan'
      });
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setScanResult(null);

    try {
      // Get API key from local storage or prompt user if not available
      const currentApiKey = apiKey || prompt('Please enter your VirusTotal API key:');
      if (!currentApiKey) {
        setIsScanning(false);
        toast.error('API key required', {
          description: 'Please provide a VirusTotal API key to continue'
        });
        return;
      }
      
      // Save API key for future use
      if (currentApiKey !== apiKey) {
        
      }

      const progressInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.floor(Math.random() * 5) + 1;
        });
      }, 300);

      try {
        let vtResults;
        
        if (selectedFile) {
          toast.info('Scanning file...', {
            description: 'This may take a moment'
          });
          vtResults = await scanFileWithVirusTotal(selectedFile, currentApiKey);
        } else if (selectedUrl) {
          toast.info('Scanning URL...', {
            description: 'This may take a moment'
          });
          vtResults = await scanUrlWithVirusTotal(selectedUrl, currentApiKey);
        }

        setScanProgress(100);

        if (vtResults.metadata?.statusCode === 500) {
          toast.error('Scan completed with errors', {
            description: 'Some scan services were unavailable'
          });
        }

        const result: ScanResultData = {
          fileName: selectedFile ? selectedFile.name : selectedUrl!,
          fileSize: selectedFile ? selectedFile.size : vtResults.metadata?.bodyLength || 0,
          fileType: selectedFile ? getFileType(selectedFile.name) : 'URL',
          scanEngine,
          isInfected: vtResults.detectionRate > 5, // Use improved threshold for infection detection
          detectionRate: vtResults.detectionRate,
          threatLevel: vtResults.threatLevel,
          engineResults: {
            virustotal: {
              positives: vtResults.stats.malicious,
              total: vtResults.stats.malicious + vtResults.stats.undetected + (vtResults.stats.suspicious || 0) + (vtResults.stats.harmless || 0),
              detectedBy: vtResults.detectedBy,
              metadata: vtResults.metadata
            }
          },
          scanDate: new Date()
        };

        setScanResult(result);
        toast[result.isInfected ? 'error' : 'success'](
          result.isInfected ? 'Threat detected!' : 'Scan completed',
          {
            description: result.isInfected 
              ? `The scanned ${selectedFile ? 'file' : 'URL'} contains malicious content` 
              : `No threats were found in the ${selectedFile ? 'file' : 'URL'}`
          }
        );
      } catch (error) {
        toast.error('Scan failed', {
          description: 'An error occurred during scanning. Please try again.'
        });
        console.error('VirusTotal scan error:', error);
      } finally {
        clearInterval(progressInterval);
      }
    } finally {
      setIsScanning(false);
    }
  };

  const handleNewScan = () => {
    setSelectedFile(null);
    setSelectedUrl(null);
    setScanResult(null);
    setScanProgress(0);
  };

  return {
    selectedFile,
    setSelectedFile,
    selectedUrl,
    setSelectedUrl,
    scanEngine,
    setScanEngine,
    isScanning,
    scanProgress,
    scanResult,
    handleStartScan,
    handleNewScan,
    apiKey,
    
  };
};

const getFileType = (fileName: string): string => {
  const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
  
  const fileTypes: { [key: string]: string } = {
    pdf: 'PDF Document',
    doc: 'Word Document',
    docx: 'Word Document',
    xls: 'Excel Spreadsheet',
    xlsx: 'Excel Spreadsheet',
    ppt: 'PowerPoint Presentation',
    pptx: 'PowerPoint Presentation',
    jpg: 'JPG Image',
    jpeg: 'JPEG Image',
    png: 'PNG Image',
    gif: 'GIF Image',
    mp3: 'Audio File',
    wav: 'Audio File',
    mp4: 'Video File',
    avi: 'Video File',
    mov: 'Video File',
    zip: 'Archive',
    rar: 'Archive',
    '7z': 'Archive',
    exe: 'Windows Executable',
    dll: 'Dynamic Link Library',
    js: 'JavaScript File',
    html: 'HTML File',
    htm: 'HTML File'
  };

  return fileTypes[fileExtension] || 'Unknown File';
};
