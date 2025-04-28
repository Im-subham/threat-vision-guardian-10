
import type { ScanResult } from '../types/virustotal';
import { saveScanResult } from './storageService';

export const scanFileWithVirusTotal = async (file: File, apiKey: string): Promise<ScanResult> => {
  try {
    // First get upload URL
    const urlResponse = await fetch('https://www.virustotal.com/api/v3/files/upload_url', {
      headers: {
        'x-apikey': apiKey
      }
    });

    if (!urlResponse.ok) {
      console.error('Failed to get upload URL:', await urlResponse.text());
      throw new Error(`Failed to get upload URL: ${urlResponse.status}`);
    }

    const urlData = await urlResponse.json();
    const uploadUrl = urlData.data;

    // Upload file
    const formData = new FormData();
    formData.append('file', file);

    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'x-apikey': apiKey
      },
      body: formData
    });

    if (!uploadResponse.ok) {
      console.error('Failed to upload file:', await uploadResponse.text());
      throw new Error(`Failed to upload file: ${uploadResponse.status}`);
    }

    const uploadData = await uploadResponse.json();
    const analysisId = uploadData.data.id;

    if (!analysisId) {
      throw new Error('Failed to get analysis ID from VirusTotal');
    }

    // Wait for analysis to complete
    let attempts = 0;
    const maxAttempts = 15;
    let reportData;

    while (attempts < maxAttempts) {
      const reportResponse = await fetch(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
        headers: {
          'x-apikey': apiKey
        }
      });

      if (!reportResponse.ok) {
        console.error('Failed to get analysis report:', await reportResponse.text());
        throw new Error(`Failed to get analysis report: ${reportResponse.status}`);
      }

      reportData = await reportResponse.json();
      const status = reportData.data?.attributes?.status;

      if (status === 'completed') {
        break;
      }

      // Wait before next attempt
      await new Promise(resolve => setTimeout(resolve, 3000));
      attempts++;
    }

    if (!reportData) {
      throw new Error('Failed to get scan results from VirusTotal');
    }

    // Process results
    const stats = reportData.data?.attributes?.stats || {};
    const lastAnalysisResults = reportData.data?.attributes?.results || {};

    const malicious = stats.malicious || 0;
    const suspicious = stats.suspicious || 0;
    const harmless = stats.harmless || 0;
    const undetected = stats.undetected || 0;
    const total = malicious + suspicious + harmless + undetected;

    const detectionRate = total > 0 ? ((malicious + suspicious) / total) * 100 : 0;

    let threatLevel: 'low' | 'medium' | 'high' | 'safe' = 'safe';
    if (detectionRate > 10) threatLevel = 'high';
    else if (detectionRate > 5) threatLevel = 'medium';
    else if (detectionRate > 0) threatLevel = 'low';

    const detectedBy = Object.entries(lastAnalysisResults)
      .filter(([, result]: [string, any]) => result.category === 'malicious' || result.category === 'suspicious')
      .map(([vendor]: [string, any]) => vendor);

    const scanResult: ScanResult = {
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
        firstSubmission: reportData.data?.attributes?.date,
        lastSubmission: reportData.data?.attributes?.date,
        lastAnalysis: reportData.data?.attributes?.date,
        bodyLength: file.size,
        bodySha256: reportData.meta?.file_info?.sha256
      }
    };

    // Save scan result
    saveScanResult(scanResult, file, 'virustotal');
    return scanResult;
  } catch (error) {
    console.error('VirusTotal API Error:', error);
    throw error;
  }
};
