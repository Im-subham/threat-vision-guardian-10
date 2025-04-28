
import type { ScanResult } from '../types/virustotal';
import { saveScanResult } from './storageService';

export const scanFileWithVirusTotal = async (file: File, apiKey: string): Promise<ScanResult> => {
  try {
    // Get file hash (SHA-256)
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // First check if file has been scanned before
    const checkResponse = await fetch(`https://www.virustotal.com/vtapi/v2/file/report?apikey=${apiKey}&resource=${hashHex}`);
    const checkData = await checkResponse.json();

    if (checkData.response_code === 1) {
      // File exists in VT database
      const positives = checkData.positives || 0;
      const total = checkData.total || 0;
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
        detectedBy: Object.entries(checkData.scans || {})
          .filter(([, result]: [string, any]) => result.detected)
          .map(([vendor]: [string, any]) => vendor),
        metadata: {
          statusCode: checkData.response_code,
          contentType: file.type,
          firstSubmission: checkData.scan_date,
          lastSubmission: checkData.scan_date,
          lastAnalysis: checkData.scan_date,
          bodyLength: file.size,
          bodySha256: hashHex,
        }
      };

      saveScanResult(scanResult, file, 'virustotal');
      return scanResult;
    }

    // If file hasn't been scanned before, upload it
    const formData = new FormData();
    formData.append('file', file);
    formData.append('apikey', apiKey);

    const uploadResponse = await fetch('https://www.virustotal.com/vtapi/v2/file/scan', {
      method: 'POST',
      body: formData
    });

    const uploadData = await uploadResponse.json();

    // Wait for initial analysis (15 seconds)
    await new Promise(resolve => setTimeout(resolve, 15000));

    // Get scan results
    const reportResponse = await fetch(`https://www.virustotal.com/vtapi/v2/file/report?apikey=${apiKey}&resource=${uploadData.scan_id}`);
    const reportData = await reportResponse.json();

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
        statusCode: reportData.response_code,
        contentType: file.type,
        firstSubmission: reportData.scan_date,
        lastSubmission: reportData.scan_date,
        lastAnalysis: reportData.scan_date,
        bodyLength: file.size,
        bodySha256: hashHex,
      }
    };

    saveScanResult(scanResult, file, 'virustotal');
    return scanResult;
  } catch (error) {
    console.error('VirusTotal API Error:', error);
    throw error;
  }
};
