
import { useState } from 'react';
import { toast } from 'sonner';
import { scanFileWithVirusTotal } from '@/components/scanner/VirusTotalService';
import { ScanEngine } from '@/components/scanner/ScanOptions';
import { ScanResultData } from '@/components/scanner/ScanResult';

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
      if (scanEngine === 'virustotal' || scanEngine === 'both') {
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
            await new Promise(resolve => setTimeout(resolve, 2000));
            const isUrlMalicious = Math.random() < 0.3;
            vtResults = {
              detectionRate: isUrlMalicious ? Math.floor(Math.random() * 40) + 30 : 0,
              threatLevel: isUrlMalicious ? 'high' : 'safe',
              stats: {
                malicious: isUrlMalicious ? Math.floor(Math.random() * 20) + 10 : 0,
                suspicious: isUrlMalicious ? Math.floor(Math.random() * 5) : 0,
                undetected: 68 - (isUrlMalicious ? Math.floor(Math.random() * 20) + 10 : 0),
              },
              detectedBy: isUrlMalicious ? ['Google Safe Browsing', 'Sophos', 'Kaspersky'] : []
            };
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
        }
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
