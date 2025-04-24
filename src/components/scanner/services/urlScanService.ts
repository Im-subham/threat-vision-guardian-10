
import type { ScanResult } from '../types/virustotal';

export const scanUrlWithVirusTotal = async (url: string, apiKey: string): Promise<ScanResult> => {
  try {
    // Submit URL for scanning
    const formData = new URLSearchParams();
    formData.append('apikey', apiKey);
    formData.append('url', url);

    const submitResponse = await fetch('https://www.virustotal.com/vtapi/v2/url/scan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString()
    });

    if (!submitResponse.ok) {
      throw new Error('Failed to submit URL for scanning');
    }

    await submitResponse.json();
    
    // Wait for analysis
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Get scan results
    const resultFormData = new URLSearchParams();
    resultFormData.append('apikey', apiKey);
    resultFormData.append('resource', url);

    const resultResponse = await fetch('https://www.virustotal.com/vtapi/v2/url/report', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });

    if (!resultResponse.ok) {
      throw new Error('Failed to get scan results');
    }

    const resultData = await resultResponse.json();

    return {
      detectionRate: (resultData.positives / resultData.total) * 100,
      threatLevel: resultData.positives > 0 ? 
        (resultData.positives > 10 ? 'high' : 'medium') : 
        'safe',
      stats: {
        malicious: resultData.positives,
        suspicious: 0,
        undetected: resultData.total - resultData.positives,
      },
      detectedBy: Object.entries(resultData.scans)
        .filter(([_, scan]: [string, any]) => scan.detected)
        .map(([name]: [string, any]) => name)
    };
  } catch (error) {
    console.error('VirusTotal URL scan error:', error);
    throw error;
  }
};
