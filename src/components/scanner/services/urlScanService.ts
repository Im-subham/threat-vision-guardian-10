
import type { ScanResult } from '../types/virustotal';
import { saveScanResult } from './storageService';

export const scanUrlWithVirusTotal = async (url: string, apiKey: string): Promise<ScanResult> => {
  try {
    // First, submit URL for scanning
    const submitResponse = await fetch('https://www.virustotal.com/vtapi/v2/url/scan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `apikey=${apiKey}&url=${encodeURIComponent(url)}`
    });

    const submitData = await submitResponse.json();

    // Wait for scan to complete (with timeout)
    await new Promise(resolve => setTimeout(resolve, 15000));

    // Get scan results
    const reportResponse = await fetch(`https://www.virustotal.com/vtapi/v2/url/report?apikey=${apiKey}&resource=${encodeURIComponent(url)}`);
    const reportData = await reportResponse.json();

    // Process the results
    const positives = reportData.positives || 0;
    const total = reportData.total || 0;
    const detectionRate = total > 0 ? (positives / total) * 100 : 0;

    let threatLevel: 'low' | 'medium' | 'high' | 'safe' = 'safe';
    if (detectionRate > 60) threatLevel = 'high';
    else if (detectionRate > 30) threatLevel = 'medium';
    else if (detectionRate > 10) threatLevel = 'low';

    const scanResult: ScanResult = {
      detectionRate,
      threatLevel,
      stats: {
        malicious: positives,
        suspicious: 0,
        undetected: total - positives,
      },
      detectedBy: Object.entries(reportData.scans || {})
        .filter(([, result]: [string, any]) => result.detected)
        .map(([vendor]: [string, any]) => vendor),
      metadata: {
        statusCode: reportData.response_code || 200,
        contentType: 'URL',
        firstSubmission: reportData.scan_date,
        lastSubmission: reportData.scan_date,
        lastAnalysis: reportData.scan_date,
        bodyLength: url.length,
        finalUrl: url,
        categories: Object.entries(reportData.scans || {})
          .map(([, result]: [string, any]) => result.result)
          .filter(Boolean)
      }
    };

    // Save scan result
    saveScanResult(scanResult, url, 'virustotal');

    return scanResult;
  } catch (error) {
    console.error('VirusTotal API Error:', error);
    throw error;
  }
};
