
import { ScanResult } from '../types/virustotal';

// Mock file scan service
export const mockScanFileWithVirusTotal = async (file: File, apiKey: string): Promise<ScanResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Generate mock detection results based on file name and size
  // This is just for simulation - in a real app, this would come from the VirusTotal API
  const isMalicious = file.name.toLowerCase().includes('virus') || 
                      file.name.toLowerCase().includes('malware') ||
                      Math.random() < 0.1; // 10% chance of being flagged
  
  const malicious = isMalicious ? Math.floor(Math.random() * 10) + 5 : Math.floor(Math.random() * 3);
  const suspicious = isMalicious ? Math.floor(Math.random() * 5) : Math.floor(Math.random() * 2);
  const harmless = Math.floor(Math.random() * 30) + 40;
  const undetected = Math.floor(Math.random() * 20) + 10;
  const total = malicious + suspicious + harmless + undetected;
  
  const detectionRate = ((malicious + suspicious) / total) * 100;
  
  let threatLevel: 'low' | 'medium' | 'high' | 'safe' = 'safe';
  if (detectionRate > 10) threatLevel = 'high';
  else if (detectionRate > 5) threatLevel = 'medium';
  else if (detectionRate > 0) threatLevel = 'low';
  
  const detectedBy = generateMockDetectedBy(malicious + suspicious);
  
  return {
    detectionRate,
    threatLevel,
    stats: {
      malicious,
      suspicious,
      undetected,
      harmless
    },
    detectedBy,
    metadata: {
      statusCode: 200,
      contentType: file.type || 'application/octet-stream',
      firstSubmission: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
      lastSubmission: new Date().toISOString(),
      lastAnalysis: new Date().toISOString(),
      bodyLength: file.size,
      bodySha256: generateMockHash()
    }
  };
};

// Mock URL scan service
export const mockScanUrlWithVirusTotal = async (url: string, apiKey: string): Promise<ScanResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  // Generate mock detection results based on URL
  // This is just for simulation - in a real app, this would come from the VirusTotal API
  const isMalicious = url.toLowerCase().includes('malware') || 
                      url.toLowerCase().includes('virus') || 
                      url.toLowerCase().includes('hack') ||
                      Math.random() < 0.1; // 10% chance of being flagged
  
  const malicious = isMalicious ? Math.floor(Math.random() * 10) + 5 : Math.floor(Math.random() * 3);
  const suspicious = isMalicious ? Math.floor(Math.random() * 5) : Math.floor(Math.random() * 2);
  const harmless = Math.floor(Math.random() * 30) + 40;
  const undetected = Math.floor(Math.random() * 20) + 10;
  const total = malicious + suspicious + harmless + undetected;
  
  const detectionRate = ((malicious + suspicious) / total) * 100;
  
  let threatLevel: 'low' | 'medium' | 'high' | 'safe' = 'safe';
  if (detectionRate > 10) threatLevel = 'high';
  else if (detectionRate > 5) threatLevel = 'medium';
  else if (detectionRate > 0) threatLevel = 'low';
  
  const detectedBy = generateMockDetectedBy(malicious + suspicious);
  const categories = ['phishing', 'malware', 'suspicious', 'safe'];
  
  return {
    detectionRate,
    threatLevel,
    stats: {
      malicious,
      suspicious,
      undetected,
      harmless
    },
    detectedBy,
    metadata: {
      statusCode: 200,
      contentType: 'text/html',
      firstSubmission: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(), // 15 days ago
      lastSubmission: new Date().toISOString(),
      lastAnalysis: new Date().toISOString(),
      bodyLength: url.length,
      finalUrl: url,
      serverIp: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      categories: isMalicious 
        ? [categories[Math.floor(Math.random() * 3)]]
        : [categories[3]]
    }
  };
};

// Helper functions for mock data generation
const generateMockDetectedBy = (count: number): string[] => {
  const vendors = [
    'McAfee', 'Symantec', 'Kaspersky', 'BitDefender', 'Avast', 
    'ESET-NOD32', 'F-Secure', 'Sophos', 'TrendMicro', 'ClamAV',
    'Microsoft', 'Avira', 'Fortinet', 'Malwarebytes', 'Panda'
  ];
  
  const result: string[] = [];
  const shuffled = [...vendors].sort(() => 0.5 - Math.random());
  
  for (let i = 0; i < Math.min(count, shuffled.length); i++) {
    result.push(shuffled[i]);
  }
  
  return result;
};

const generateMockHash = () => {
  const characters = 'abcdef0123456789';
  let result = '';
  for (let i = 0; i < 64; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
