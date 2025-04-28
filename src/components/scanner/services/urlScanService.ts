
import type { ScanResult } from '../types/virustotal';
import { saveScanResult } from './storageService';

export const scanUrlWithVirusTotal = async (url: string, apiKey: string): Promise<ScanResult> => {
  try {
    // First, submit URL for scanning using the v3 API
    const encodedUrl = encodeURIComponent(url);
    const submitResponse = await fetch(`https://www.virustotal.com/api/v3/urls`, {
      method: 'POST',
      headers: {
        'x-apikey': apiKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `url=${encodedUrl}`
    });

    if (!submitResponse.ok) {
      throw new Error(`VirusTotal API submission error: ${submitResponse.status}`);
    }

    const submitData = await submitResponse.json();
    const analysisId = submitData.data?.id;
    
    if (!analysisId) {
      throw new Error('Failed to get analysis ID from VirusTotal');
    }
    
    // Wait for scan to complete (with timeout)
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Get scan results using the v3 API
    const reportResponse = await fetch(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
      headers: {
        'x-apikey': apiKey
      }
    });

    if (!reportResponse.ok) {
      throw new Error(`VirusTotal API report error: ${reportResponse.status}`);
    }

    const reportData = await reportResponse.json();
    
    // Process the results
    const stats = reportData.data?.attributes?.stats || {};
    const lastAnalysisResults = reportData.data?.attributes?.results || {};
    
    const malicious = stats.malicious || 0;
    const suspicious = stats.suspicious || 0;
    const harmless = stats.harmless || 0;
    const undetected = stats.undetected || 0;
    const total = malicious + suspicious + harmless + undetected;
    
    const detectionRate = total > 0 ? (malicious / total) * 100 : 0;

    let threatLevel: 'low' | 'medium' | 'high' | 'safe' = 'safe';
    if (detectionRate > 5) threatLevel = 'high';
    else if (detectionRate > 2) threatLevel = 'medium';
    else if (detectionRate > 0) threatLevel = 'low';

    // Get detected vendors
    const detectedBy = Object.entries(lastAnalysisResults)
      .filter(([, result]: [string, any]) => result.category === 'malicious')
      .map(([vendor]: [string, any]) => vendor);

    // Get categories
    const categories = Object.entries(lastAnalysisResults)
      .map(([, result]: [string, any]) => result.result)
      .filter(Boolean);

    const scanResult: ScanResult = {
      detectionRate,
      threatLevel,
      stats: {
        malicious,
        suspicious,
        undetected,
        harmless: harmless || 0
      },
      detectedBy,
      metadata: {
        statusCode: 200,
        contentType: 'URL',
        firstSubmission: reportData.data?.attributes?.date || new Date().toISOString(),
        lastSubmission: reportData.data?.attributes?.date || new Date().toISOString(),
        lastAnalysis: reportData.data?.attributes?.date || new Date().toISOString(),
        bodyLength: url.length,
        finalUrl: url,
        categories: categories
      }
    };

    // Save scan result
    saveScanResult(scanResult, url, 'virustotal');

    return scanResult;
  } catch (error) {
    console.error('VirusTotal API Error:', error);
    
    // Create fallback result for when API fails
    const fallbackResult: ScanResult = {
      detectionRate: 0,
      threatLevel: 'safe',
      stats: {
        malicious: 0,
        suspicious: 0,
        undetected: 1,
        harmless: 0
      },
      detectedBy: [],
      metadata: {
        statusCode: 500,
        contentType: 'URL',
        bodyLength: url.length,
        finalUrl: url,
        categories: ['API Error - Unable to scan']
      }
    };
    
    return fallbackResult;
  }
};
