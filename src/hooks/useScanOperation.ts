
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
      const apiKey = localStorage.getItem('virusTotalApiKey') || prompt('Please enter your VirusTotal API key:');
      if (!apiKey) {
        setIsScanning(false);
        toast.error('API key required', {
          description: 'Please provide a VirusTotal API key to continue'
        });
        return;
      }
      localStorage.setItem('virusTotalApiKey', apiKey);

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
          vtResults = await scanFileWithVirusTotal(selectedFile, apiKey);
        } else if (selectedUrl) {
          vtResults = await scanUrlWithVirusTotal(selectedUrl, apiKey);
        }

        setScanProgress(100);

        const result: ScanResultData = {
          fileName: selectedFile ? selectedFile.name : selectedUrl!,
          fileSize: selectedFile ? selectedFile.size : 0,
          fileType: selectedFile ? getFileType(selectedFile.name) : 'URL',
          scanEngine,
          isInfected: vtResults.detectionRate > 0,
          detectionRate: vtResults.detectionRate,
          threatLevel: vtResults.threatLevel,
          engineResults: {
            virustotal: {
              positives: vtResults.stats.malicious,
              total: vtResults.stats.malicious + vtResults.stats.undetected,
              detectedBy: vtResults.detectedBy
            }
          },
          scanDate: new Date()
        };

        setScanResult(result);
        toast[result.isInfected ? 'error' : 'success'](
          result.isInfected ? 'Threat detected!' : 'Scan completed',
          {
            description: result.isInfected 
              ? 'The scanned content contains malicious code' 
              : 'No threats were found'
          }
        );
      } catch (error) {
        toast.error('VirusTotal scan failed', {
          description: 'An error occurred while scanning'
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
    handleNewScan
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
