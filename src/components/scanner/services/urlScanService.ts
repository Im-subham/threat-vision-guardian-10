
import type { ScanResult } from '../types/virustotal';
import { saveScanResult } from './storageService';

export const scanUrlWithVirusTotal = async (url: string, apiKey: string): Promise<ScanResult> => {
  try {
    console.log(`Starting simulated scan for URL: ${url}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate risk based on URL patterns
    const isSuspicious = /\.(xyz|tk|ml|ga|cf|gq|pw)$/.test(url) || 
      url.includes('download') || 
      url.includes('free') ||
      url.includes('win') ||
      url.match(/[0-9]{4,}/) !== null;
    
    // Determine detection rate based on URL patterns
    const detectionRate = isSuspicious 
      ? Math.floor(Math.random() * 40) + 20  // 20-60% for suspicious URLs
      : Math.floor(Math.random() * 15);      // 0-15% for normal URLs
    
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

    // Generate simulated metadata
    const currentDate = new Date();
    const firstSubmissionDate = new Date(currentDate);
    firstSubmissionDate.setMonth(currentDate.getMonth() - 2);
    
    // Generate a date 3 days ago for lastAnalysis
    const lastAnalysisDate = new Date(currentDate);
    lastAnalysisDate.setDate(currentDate.getDate() - 3);

    const metadata = {
      statusCode: 200,
      contentType: 'text/html; charset=UTF-8',
      firstSubmission: firstSubmissionDate.toISOString(),
      lastSubmission: currentDate.toISOString(),
      lastAnalysis: lastAnalysisDate.toISOString(),
      serverIp: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      bodyLength: Math.floor(Math.random() * 100000) + 50000,
      bodySha256: Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join(''),
      categories: ['educational institutions'],
      finalUrl: url.startsWith('http') ? url : `https://${url}`
    };
    
    console.log(`URL scan simulation complete - Detection rate: ${detectionRate}%, Threat level: ${threatLevel}`);
    
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
      detectedBy,
      metadata
    };
    
    // Save scan result to localStorage
    const mockFile = {
      name: url,
      size: metadata.bodyLength,
      type: 'URL'
    };
    saveScanResult(scanResult, mockFile as File, 'virustotal');
    
    return scanResult;
    
  } catch (error) {
    console.error('VirusTotal URL scan error:', error);
    throw error;
  }
};
