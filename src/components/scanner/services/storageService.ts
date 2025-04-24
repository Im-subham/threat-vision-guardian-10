
import { ScanResult } from '../types/virustotal';

export const saveScanResult = (scanResult: ScanResult, file: File, scanEngine: string) => {
  try {
    // Get existing scan history
    const existingHistoryJson = localStorage.getItem('scanHistory');
    const existingHistory = existingHistoryJson ? JSON.parse(existingHistoryJson) : [];
    
    // Create new scan result entry
    const newScanResult = {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type || (file.name.includes('://') ? 'URL' : file.name.split('.').pop()?.toUpperCase() + ' File'),
      scanEngine: scanEngine,
      isInfected: scanResult.detectionRate > 0,
      detectionRate: scanResult.detectionRate,
      threatLevel: scanResult.threatLevel,
      engineResults: {
        virustotal: {
          positives: scanResult.stats.malicious,
          total: scanResult.stats.malicious + scanResult.stats.undetected,
          detectedBy: scanResult.detectedBy
        }
      },
      scanDate: new Date().toISOString()
    };
    
    // Add to history and limit to 50 entries
    const updatedHistory = [newScanResult, ...existingHistory].slice(0, 50);
    localStorage.setItem('scanHistory', JSON.stringify(updatedHistory));
    
    return newScanResult;
  } catch (error) {
    console.error('Error saving scan result to localStorage:', error);
    return null;
  }
};
