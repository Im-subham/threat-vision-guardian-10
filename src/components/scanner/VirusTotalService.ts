interface VirusTotalResponse {
  data: {
    attributes: {
      last_analysis_results: {
        [key: string]: {
          category: string;
          result: string | null;
        };
      };
      last_analysis_stats: {
        malicious: number;
        suspicious: number;
        undetected: number;
        timeout: number;
        [key: string]: number;
      };
    };
  };
}

// Helper function to save scan result to localStorage
const saveScanResult = (scanResult: any, file: File, scanEngine: string) => {
  try {
    // Get existing scan history
    const existingHistoryJson = localStorage.getItem('scanHistory');
    const existingHistory = existingHistoryJson ? JSON.parse(existingHistoryJson) : [];
    
    // Create new scan result entry
    const newScanResult = {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type || file.name.split('.').pop()?.toUpperCase() + ' File',
      scanEngine: scanEngine,
      isInfected: scanResult.detectionRate > 0,
      detectionRate: scanResult.detectionRate,
      threatLevel: scanResult.threatLevel,
      engineResults: {
        virustotal: {
          positives: scanResult.stats.malicious,
          total: scanResult.stats.malicious + scanResult.stats.undetected,
          detectedBy: scanResult.detectedBy
        }
      },
      scanDate: new Date().toISOString() // Store as string for JSON serialization
    };
    
    // Add to history
    const updatedHistory = [newScanResult, ...existingHistory];
    
    // Store back in localStorage (limit to 50 entries to prevent storage issues)
    localStorage.setItem('scanHistory', JSON.stringify(updatedHistory.slice(0, 50)));
    
    return newScanResult;
  } catch (error) {
    console.error('Error saving scan result to localStorage:', error);
    return null;
  }
};

export const scanUrlWithVirusTotal = async (url: string, apiKey: string): Promise<any> => {
  try {
    // First, get the scan ID by submitting the URL
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

    const submitData = await submitResponse.json();
    
    // Wait for a few seconds to allow initial analysis
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Get the scan results
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

    // Process and return the results
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

export const scanFileWithVirusTotal = async (file: File, apiKey: string): Promise<any> => {
  try {
    // For browser-based scanning, we need to use a proxy or backend service
    // VirusTotal API doesn't support direct browser requests due to CORS restrictions
    
    // We'll simulate a successful scan for demo purposes
    // In a production environment, you would need to:
    // 1. Create a backend endpoint that proxies requests to VirusTotal
    // 2. Call that endpoint instead of calling VirusTotal directly from the browser
    
    console.log(`Starting simulated scan for file: ${file.name} with size: ${file.size} bytes`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate risk level based on file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    const isExecutable = ['exe', 'dll', 'bat', 'msi', 'js', 'vbs'].includes(fileExtension);
    
    // Higher chance of detection for executable files
    const detectionRate = isExecutable 
      ? Math.floor(Math.random() * 40) + 30  // 30-70% for executables
      : Math.floor(Math.random() * 20);      // 0-20% for non-executables
    
    let threatLevel: 'low' | 'medium' | 'high' | 'safe' = 'safe';
    if (detectionRate > 75) threatLevel = 'high';
    else if (detectionRate > 50) threatLevel = 'medium';
    else if (detectionRate > 0) threatLevel = 'low';
    
    // Generate list of antivirus engines
    const antivirusVendors = [
      'Avast', 'AVG', 'BitDefender', 'ClamAV', 'ESET', 'F-Secure', 
      'Kaspersky', 'McAfee', 'Microsoft', 'Norton', 'Panda', 'Sophos',
      'Symantec', 'TrendMicro', 'Webroot', 'Avira'
    ];
    
    const total = 68; // Total number of scanners
    const malicious = Math.floor((detectionRate / 100) * total);
    
    const detectedBy = detectionRate > 0 
      ? antivirusVendors
          .sort(() => 0.5 - Math.random())
          .slice(0, malicious)
      : [];
    
    console.log(`Simulation complete - Detection rate: ${detectionRate}%, Threat level: ${threatLevel}`);
    
    // Create scan result
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
      detectedBy
    };
    
    // Save scan result to localStorage
    saveScanResult(scanResult, file, 'virustotal');
    
    // Return simulated result that matches the expected structure
    return scanResult;
    
    /* Real VirusTotal API implementation (needs a backend proxy)
    // Step 1: Get upload URL
    const urlResponse = await fetch('https://www.virustotal.com/api/v3/files/upload_url', {
      headers: {
        'x-apikey': apiKey
      }
    });
    const { data } = await urlResponse.json();
    const upload_url = data.url;

    // Step 2: Upload file
    const formData = new FormData();
    formData.append('file', file);
    
    const uploadResponse = await fetch(upload_url, {
      method: 'POST',
      headers: {
        'x-apikey': apiKey
      },
      body: formData
    });
    const uploadData = await uploadResponse.json();
    const id = uploadData.data.id;

    // Step 3: Get analysis results
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      const analysisResponse = await fetch(`https://www.virustotal.com/api/v3/analyses/${id}`, {
        headers: {
          'x-apikey': apiKey
        }
      });
      
      const result: VirusTotalResponse = await analysisResponse.json();
      
      if (result.data.attributes.last_analysis_stats) {
        const stats = result.data.attributes.last_analysis_stats;
        const detectionRate = Math.round((stats.malicious / (stats.malicious + stats.undetected)) * 100);
        
        let threatLevel: 'low' | 'medium' | 'high' | 'safe' = 'safe';
        if (detectionRate > 75) threatLevel = 'high';
        else if (detectionRate > 50) threatLevel = 'medium';
        else if (detectionRate > 0) threatLevel = 'low';

        return {
          detectionRate,
          threatLevel,
          stats,
          detectedBy: Object.entries(result.data.attributes.last_analysis_results)
            .filter(([_, value]) => value.category === 'malicious')
            .map(([key]) => key)
        };
      }

      attempts++;
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before next attempt
    }

    throw new Error('Analysis timeout');
    */
    
  } catch (error) {
    console.error('VirusTotal API Error:', error);
    throw error;
  }
};
