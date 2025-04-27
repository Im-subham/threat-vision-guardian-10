
import { ScanResult } from '../types/virustotal';

export const saveScanResult = (scanResult: ScanResult, file: File | string, scanEngine: string) => {
  try {
    // Get existing scan history
    const existingHistoryJson = localStorage.getItem('scanHistory');
    const existingHistory = existingHistoryJson ? JSON.parse(existingHistoryJson) : [];
    
    // Determine if this is a file or URL
    const isFile = file instanceof File;
    const fileName = isFile ? (file as File).name : file as string;
    const fileSize = isFile ? (file as File).size : scanResult.metadata?.bodyLength || 0;
    const fileType = isFile 
      ? ((file as File).type || (fileName.includes('://') ? 'URL' : fileName.split('.').pop()?.toUpperCase() + ' File')) 
      : 'URL';
    
    // Create new scan result entry with improved threat detection
    const newScanResult = {
      fileName: fileName,
      fileSize: fileSize,
      fileType: fileType,
      scanEngine: scanEngine,
      isInfected: scanResult.detectionRate > 10, // Use improved threshold
      detectionRate: scanResult.detectionRate,
      threatLevel: scanResult.threatLevel,
      engineResults: {
        virustotal: {
          positives: scanResult.stats.malicious,
          total: scanResult.stats.malicious + scanResult.stats.undetected + (scanResult.stats.suspicious || 0),
          detectedBy: scanResult.detectedBy,
          metadata: scanResult.metadata
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
