
import type { ScanResult } from '../types/virustotal';
import { saveScanResult } from './storageService';

export const scanUrlWithVirusTotal = async (url: string, apiKey: string): Promise<ScanResult> => {
  try {
    // First, submit URL for scanning
    const encodedUrl = encodeURIComponent(url);
    const submitResponse = await fetch('https://www.virustotal.com/api/v3/urls', {
      method: 'POST',
      headers: {
        'x-apikey': apiKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `url=${encodedUrl}`
    });

    if (!submitResponse.ok) {
      console.error('VirusTotal URL submission failed:', await submitResponse.text());
      throw new Error(`VirusTotal API submission error: ${submitResponse.status}`);
    }

    const submitData = await submitResponse.json();
    const analysisId = submitData.data.id;

    if (!analysisId) {
      throw new Error('Failed to get analysis ID from VirusTotal');
    }

    // Wait for the scan to complete
    let attempts = 0;
    const maxAttempts = 10;
    let reportData;

    while (attempts < maxAttempts) {
      const reportResponse = await fetch(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
        headers: {
          'x-apikey': apiKey
        }
      });

      if (!reportResponse.ok) {
        console.error('VirusTotal analysis fetch failed:', await reportResponse.text());
        throw new Error(`VirusTotal API report error: ${reportResponse.status}`);
      }

      reportData = await reportResponse.json();
      const status = reportData.data?.attributes?.status;

      if (status === 'completed') {
        break;
      }

      // Wait before next attempt
      await new Promise(resolve => setTimeout(resolve, 2000));
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
        contentType: 'URL',
        firstSubmission: reportData.data?.attributes?.date,
        lastSubmission: reportData.data?.attributes?.date,
        lastAnalysis: reportData.data?.attributes?.date,
        bodyLength: url.length,
        finalUrl: url,
        categories: Object.values(lastAnalysisResults)
          .map((result: any) => result.result)
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
