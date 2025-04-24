
import type { ScanResult } from '../types/virustotal';
import { saveScanResult } from './storageService';

export const scanFileWithVirusTotal = async (file: File, apiKey: string): Promise<ScanResult> => {
  try {
    console.log(`Starting simulated scan for file: ${file.name} with size: ${file.size} bytes`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate risk level based on file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    const isExecutable = ['exe', 'dll', 'bat', 'msi', 'js', 'vbs'].includes(fileExtension);
    
    // Higher chance of detection for executable files
    const detectionRate = isExecutable 
      ? Math.floor(Math.random() * 40) + 30  // 30-70% for executables
      : Math.floor(Math.random() * 20);      // 0-20% for non-executables
    
    let threatLevel: 'low' | 'medium' | 'high' | 'safe' = 'safe';
    if (detectionRate > 75) threatLevel = 'high';
    else if (detectionRate > 50) threatLevel = 'medium';
    else if (detectionRate > 0) threatLevel = 'low';
    
    const antivirusVendors = [
      'Avast', 'AVG', 'BitDefender', 'ClamAV', 'ESET', 'F-Secure', 
      'Kaspersky', 'McAfee', 'Microsoft', 'Norton', 'Panda', 'Sophos',
      'Symantec', 'TrendMicro', 'Webroot', 'Avira'
    ];
    
    const total = 68;
    const malicious = Math.floor((detectionRate / 100) * total);
    
    const detectedBy = detectionRate > 0 
      ? antivirusVendors
          .sort(() => 0.5 - Math.random())
          .slice(0, malicious)
      : [];
    
    console.log(`Simulation complete - Detection rate: ${detectionRate}%, Threat level: ${threatLevel}`);
    
    const scanResult = {
      detectionRate,
      threatLevel,
      stats: {
        malicious,
        undetected: total - malicious,
        suspicious: 0,
        timeout: 0,
        harmless: total - malicious
      },
      detectedBy
    };
    
    // Save scan result to localStorage
    saveScanResult(scanResult, file, 'virustotal');
    
    return scanResult;
  } catch (error) {
    console.error('VirusTotal API Error:', error);
    throw error;
  }
};
