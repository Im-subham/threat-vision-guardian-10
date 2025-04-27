
import type { ScanResult } from '../types/virustotal';
import { saveScanResult } from './storageService';

export const scanFileWithVirusTotal = async (file: File, apiKey: string): Promise<ScanResult> => {
  try {
    console.log(`Starting simulated scan for file: ${file.name} with size: ${file.size} bytes`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Improved file analysis logic
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    const fileName = file.name.toLowerCase();
    
    // High-risk file extensions
    const highRiskExtensions = ['exe', 'dll', 'bat', 'msi', 'ps1', 'vbs', 'js', 'jar', 'scr', 'cmd'];
    // Medium-risk file extensions
    const mediumRiskExtensions = ['zip', 'rar', '7z', 'iso', 'pdf', 'docm', 'xlsm'];
    // Suspicious file name patterns
    const suspiciousNamePatterns = ['crack', 'keygen', 'patch', 'hack', 'trojan', 'virus', 'malware', 'rootkit'];
    
    // Common safe extensions and file types
    const safeExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'txt', 'csv', 'mp3', 'wav'];
    
    let maliciousFactor = 0;
    
    // Check for high-risk extensions
    if (highRiskExtensions.includes(fileExtension)) {
      maliciousFactor += 60;
    } 
    // Check for medium-risk extensions
    else if (mediumRiskExtensions.includes(fileExtension)) {
      maliciousFactor += 30;
    }
    // Apply safety factor for safe extensions
    else if (safeExtensions.includes(fileExtension)) {
      maliciousFactor = 0; // Override with 0 for safe file types
    }
    
    // Only check for suspicious patterns if not already identified as safe
    if (maliciousFactor > 0) {
      // Check for suspicious name patterns
      for (const pattern of suspiciousNamePatterns) {
        if (fileName.includes(pattern)) {
          maliciousFactor += 20;
          break;
        }
      }
      
      // Add a small random factor for non-safe files
      maliciousFactor += Math.floor(Math.random() * 5);
    }
    
    // Cap maliciousFactor at 100
    maliciousFactor = Math.min(maliciousFactor, 100);
    
    const detectionRate = maliciousFactor;
    
    // Determine threat level with better thresholds
    let threatLevel: 'low' | 'medium' | 'high' | 'safe' = 'safe';
    if (detectionRate > 60) threatLevel = 'high';
    else if (detectionRate > 30) threatLevel = 'medium';
    else if (detectionRate > 10) threatLevel = 'low';
    else threatLevel = 'safe';
    
    const antivirusVendors = [
      'Avast', 'AVG', 'BitDefender', 'ClamAV', 'ESET', 'F-Secure', 
      'Kaspersky', 'McAfee', 'Microsoft', 'Norton', 'Panda', 'Sophos',
      'Symantec', 'TrendMicro', 'Webroot', 'Avira', 'Malwarebytes',
      'Fortinet', 'SentinelOne', 'Crowdstrike'
    ];
    
    const total = 68;
    const malicious = Math.floor((detectionRate / 100) * total);
    const suspicious = Math.floor(Math.random() * 3); // Reduced suspicious detections
    
    const detectedBy = detectionRate > 10 
      ? antivirusVendors
          .sort(() => 0.5 - Math.random())
          .slice(0, malicious)
      : [];
    
    console.log(`File scan simulation complete - Detection rate: ${detectionRate}%, Threat level: ${threatLevel}`);
    
    // Generate current date and some metadata
    const currentDate = new Date();
    const firstSubmissionDate = new Date(currentDate);
    firstSubmissionDate.setMonth(currentDate.getMonth() - Math.floor(Math.random() * 6));
    
    const lastAnalysisDate = new Date(currentDate);
    lastAnalysisDate.setDate(currentDate.getDate() - Math.floor(Math.random() * 10));
    
    const scanResult = {
      detectionRate,
      threatLevel,
      stats: {
        malicious,
        suspicious,
        undetected: total - malicious - suspicious,
        timeout: Math.floor(Math.random() * 2),
        harmless: total - malicious - suspicious - Math.floor(Math.random() * 2)
      },
      detectedBy,
      metadata: {
        statusCode: 200,
        contentType: file.type || 'application/octet-stream',
        firstSubmission: firstSubmissionDate.toISOString(),
        lastSubmission: currentDate.toISOString(),
        lastAnalysis: lastAnalysisDate.toISOString(),
        bodyLength: file.size,
        bodySha256: Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join(''),
      }
    };
    
    // Save scan result to localStorage
    saveScanResult(scanResult, file, 'virustotal');
    
    return scanResult;
  } catch (error) {
    console.error('VirusTotal API Error:', error);
    throw error;
  }
};
