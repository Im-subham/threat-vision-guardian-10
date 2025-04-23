import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FileUpload from '@/components/scanner/FileUpload';
import UrlInput from '@/components/scanner/UrlInput';
import ScanOptions, { ScanEngine } from '@/components/scanner/ScanOptions';
import ScanResult, { ScanResultData } from '@/components/scanner/ScanResult';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { scanFileWithVirusTotal } from '@/components/scanner/VirusTotalService';

const ScanPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [scanEngine, setScanEngine] = useState<ScanEngine>('both');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState<ScanResultData | null>(null);

  // Handle file selection
  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    setSelectedUrl(null);
    setScanResult(null);
  };

  // Handle URL submission
  const handleUrlSubmitted = (url: string) => {
    setSelectedUrl(url);
    setSelectedFile(null);
    setScanResult(null);
  };

  // Handle scan initiation
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

        // Simulate initial progress
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
            // Simulate URL scan for demo
            await new Promise(resolve => setTimeout(resolve, 2000));
            const isUrlMalicious = Math.random() < 0.3; // 30% chance of being malicious
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
          
          clearInterval(progressInterval);
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

  // Simulate scan completion with mock results
  const simulateCompleteScan = () => {
    // Simulate API delay
    setTimeout(() => {
      if (!selectedFile) return;

      // Generate random scan result based on file type
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase() || '';
      const isExecutable = ['exe', 'dll', 'bat', 'msi', 'js'].includes(fileExtension);
      
      // Higher chance of infection for executable files (for demo purposes)
      const infectionChance = isExecutable ? 0.7 : 0.1;
      const isInfected = Math.random() < infectionChance;
      
      // Determine file type
      let fileType = 'Unknown File';
      if (['pdf'].includes(fileExtension)) fileType = 'PDF Document';
      else if (['doc', 'docx'].includes(fileExtension)) fileType = 'Word Document';
      else if (['xls', 'xlsx'].includes(fileExtension)) fileType = 'Excel Spreadsheet';
      else if (['ppt', 'pptx'].includes(fileExtension)) fileType = 'PowerPoint Presentation';
      else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) fileType = `${fileExtension.toUpperCase()} Image`;
      else if (['mp3', 'wav'].includes(fileExtension)) fileType = 'Audio File';
      else if (['mp4', 'avi', 'mov'].includes(fileExtension)) fileType = 'Video File';
      else if (['zip', 'rar', '7z'].includes(fileExtension)) fileType = 'Archive';
      else if (['exe'].includes(fileExtension)) fileType = 'Windows Executable';
      else if (['dll'].includes(fileExtension)) fileType = 'Dynamic Link Library';
      else if (['js'].includes(fileExtension)) fileType = 'JavaScript File';
      else if (['html', 'htm'].includes(fileExtension)) fileType = 'HTML File';
      
      // Generate random detection rate and threat level
      const detectionRate = isInfected ? Math.floor(Math.random() * 60) + 40 : 0;
      
      let threatLevel: 'low' | 'medium' | 'high' | 'safe' = 'safe';
      if (isInfected) {
        if (detectionRate > 75) threatLevel = 'high';
        else if (detectionRate > 50) threatLevel = 'medium';
        else threatLevel = 'low';
      }
      
      // Generate engine results based on selected scan engine
      const engineResults: any = {};
      
      if (scanEngine === 'virustotal' || scanEngine === 'both') {
        const total = 68; // Total number of antivirus engines
        const positives = isInfected ? Math.floor((detectionRate / 100) * total) : 0;
        
        // Generate random list of antivirus engines that detected the threat
        const antivirusVendors = [
          'Avast', 'AVG', 'BitDefender', 'ClamAV', 'ESET', 'F-Secure', 
          'Kaspersky', 'McAfee', 'Microsoft', 'Norton', 'Panda', 'Sophos',
          'Symantec', 'TrendMicro', 'Webroot', 'Avira'
        ];
        
        const detectedBy = isInfected 
          ? antivirusVendors
              .sort(() => 0.5 - Math.random())
              .slice(0, positives)
          : [];
        
        engineResults.virustotal = {
          positives,
          total,
          detectedBy
        };
      }
      
      if (scanEngine === 'ml' || scanEngine === 'both') {
        const malwareTypes = [
          'Trojan', 'Adware', 'Spyware', 'Ransomware', 'Worm', 
          'Backdoor', 'Rootkit', 'Keylogger', 'Potentially Unwanted Program'
        ];
        
        const confidence = isInfected 
          ? Math.floor(Math.random() * 20) + 80 
          : Math.floor(Math.random() * 10) + 90;
        
        engineResults.ml = {
          confidence,
          isInfected,
          ...(isInfected && { 
            malwareType: malwareTypes[Math.floor(Math.random() * malwareTypes.length)] 
          })
        };
      }
      
      // Create the final scan result
      const result: ScanResultData = {
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileType,
        scanEngine,
        isInfected,
        ...(detectionRate > 0 && { detectionRate }),
        threatLevel,
        engineResults,
        scanDate: new Date()
      };
      
      setScanResult(result);
      setIsScanning(false);
      
      toast[isInfected ? 'error' : 'success'](
        isInfected ? 'Threat detected!' : 'Scan completed',
        {
          description: isInfected 
            ? 'The scanned file contains malicious code' 
            : 'No threats were found in the file'
        }
      );
    }, 1000);
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

  // Reset state for a new scan
  const handleNewScan = () => {
    setSelectedFile(null);
    setSelectedUrl(null);
    setScanResult(null);
    setScanProgress(0);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#14151A] text-white">
      <Navbar />
      <div className="flex-1 pt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <img 
              src="/lovable-uploads/578e1dcf-aaef-4393-9807-6c48f3105905.png" 
              alt="VirusTotal Logo" 
              className="h-16 mx-auto mb-6"
            />
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              Analyze suspicious files, domains, IPs and URLs to detect malware and other
              breaches, automatically share them with the security community.
            </p>

            <Tabs defaultValue="file" className="w-full">
              <TabsList className="w-full max-w-md grid grid-cols-3 h-12 mb-8 bg-[#1E1F25]">
                <TabsTrigger 
                  value="file"
                  className="text-lg data-[state=active]:bg-[#3367d6] data-[state=active]:text-white"
                >
                  FILE
                </TabsTrigger>
                <TabsTrigger 
                  value="url"
                  className="text-lg data-[state=active]:bg-[#3367d6] data-[state=active]:text-white"
                >
                  URL
                </TabsTrigger>
                <TabsTrigger 
                  value="search"
                  className="text-lg data-[state=active]:bg-[#3367d6] data-[state=active]:text-white"
                >
                  SEARCH
                </TabsTrigger>
              </TabsList>

              <TabsContent value="file" className="mt-0">
                <FileUpload 
                  onFileSelected={handleFileSelected}
                  isScanning={isScanning}
                />
              </TabsContent>

              <TabsContent value="url" className="mt-0">
                <UrlInput 
                  onUrlSubmitted={handleUrlSubmitted}
                  isScanning={isScanning}
                />
              </TabsContent>

              <TabsContent value="search" className="mt-0">
                <div className="text-center py-12 text-gray-400">
                  Search functionality coming soon
                </div>
              </TabsContent>
            </Tabs>

            {(selectedFile || selectedUrl) && !isScanning && !scanResult && (
              <div className="mt-6 flex justify-center">
                <Button 
                  onClick={handleStartScan} 
                  disabled={isScanning}
                  className="bg-[#3367d6] hover:bg-[#3367d6]/90 text-white px-8 py-2 rounded"
                >
                  Start Scan
                </Button>
              </div>
            )}

            <ScanResult 
              result={scanResult}
              isScanning={isScanning}
              scanProgress={scanProgress}
              onNewScan={handleNewScan}
            />

            <div className="mt-8 text-sm text-gray-500">
              <p>
                By submitting data above, you are agreeing to our Terms of Service and Privacy Notice, 
                and to the sharing of your submission with the security community.
              </p>
              <p className="mt-2">
                Please do not submit any personal information; we are not responsible for the contents of your submission.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ScanPage;
