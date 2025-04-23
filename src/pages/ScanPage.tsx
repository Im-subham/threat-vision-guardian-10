
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FileUpload from '@/components/scanner/FileUpload';
import ScanOptions, { ScanEngine } from '@/components/scanner/ScanOptions';
import ScanResult, { ScanResultData } from '@/components/scanner/ScanResult';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const ScanPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [scanEngine, setScanEngine] = useState<ScanEngine>('both');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState<ScanResultData | null>(null);

  // Handle file selection
  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    setScanResult(null);
  };

  // Handle scan initiation
  const handleStartScan = () => {
    if (!selectedFile) {
      toast.error('No file selected', {
        description: 'Please select a file to scan'
      });
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setScanResult(null);

    // Simulate scanning progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          simulateCompleteScan();
          return 100;
        }
        return prev + Math.floor(Math.random() * 5) + 1;
      });
    }, 300);
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

  // Reset state for a new scan
  const handleNewScan = () => {
    setSelectedFile(null);
    setScanResult(null);
    setScanProgress(0);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Malware Scanner</h1>
            
            <ScanOptions 
              selectedEngine={scanEngine}
              onEngineChange={setScanEngine}
              disabled={isScanning}
            />
            
            <FileUpload 
              onFileSelected={handleFileSelected}
              isScanning={isScanning}
            />
            
            {selectedFile && !isScanning && !scanResult && (
              <div className="mt-6 flex justify-center">
                <Button onClick={handleStartScan} disabled={isScanning} size="lg">
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
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ScanPage;
