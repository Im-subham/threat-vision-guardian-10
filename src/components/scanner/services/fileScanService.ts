
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
    const checkResponse = await fetch(`https://www.virustotal.com/api/v3/files/${hashHex}`, {
      headers: {
        'x-apikey': apiKey
      }
    });

    // If file exists in database, get the results
    if (checkResponse.ok) {
      const checkData = await checkResponse.json();
      const lastAnalysisStats = checkData.data?.attributes?.last_analysis_stats || {};
      const lastAnalysisResults = checkData.data?.attributes?.last_analysis_results || {};
      
      const malicious = lastAnalysisStats.malicious || 0;
      const suspicious = lastAnalysisStats.suspicious || 0;
      const harmless = lastAnalysisStats.harmless || 0;
      const undetected = lastAnalysisStats.undetected || 0;
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

      const scanDate = checkData.data?.attributes?.last_analysis_date 
        ? new Date(checkData.data.attributes.last_analysis_date * 1000).toISOString()
        : new Date().toISOString();

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
          contentType: file.type,
          firstSubmission: scanDate,
          lastSubmission: scanDate,
          lastAnalysis: scanDate,
          bodyLength: file.size,
          bodySha256: hashHex,
        }
      };

      saveScanResult(scanResult, file, 'virustotal');
      return scanResult;
    }

    // If file hasn't been scanned before or API call failed, use upload URL API
    const urlResponse = await fetch('https://www.virustotal.com/api/v3/files/upload_url', {
      headers: {
        'x-apikey': apiKey
      }
    });

    if (!urlResponse.ok) {
      throw new Error(`Failed to get upload URL: ${urlResponse.status}`);
    }

    const urlData = await urlResponse.json();
    const uploadUrl = urlData.data;

    // Upload file to the obtained URL
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
      throw new Error(`Failed to upload file: ${uploadResponse.status}`);
    }
    
    const uploadData = await uploadResponse.json();
    const analysisId = uploadData.data?.id;
    
    if (!analysisId) {
      throw new Error('Failed to get analysis ID from VirusTotal');
    }

    // Wait for initial analysis
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Get scan results
    const reportResponse = await fetch(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
      headers: {
        'x-apikey': apiKey
      }
    });

    if (!reportResponse.ok) {
      throw new Error(`Failed to get analysis report: ${reportResponse.status}`);
    }

    const reportData = await reportResponse.json();
    const stats = reportData.data?.attributes?.stats || {};
    
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
    const detectedBy = Object.entries(reportData.data?.attributes?.results || {})
      .filter(([, result]: [string, any]) => result.category === 'malicious')
      .map(([vendor]: [string, any]) => vendor);

    const scanDate = reportData.data?.attributes?.date || new Date().toISOString();

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
        contentType: file.type,
        firstSubmission: scanDate,
        lastSubmission: scanDate,
        lastAnalysis: scanDate,
        bodyLength: file.size,
        bodySha256: hashHex,
      }
    };

    saveScanResult(scanResult, file, 'virustotal');
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
      },
      detectedBy: [],
      metadata: {
        statusCode: 500,
        contentType: file.type || 'application/octet-stream',
        bodyLength: file.size,
        categories: ['API Error - Unable to scan'],
      }
    };
    
    return fallbackResult;
  }
};
