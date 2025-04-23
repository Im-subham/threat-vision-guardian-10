
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

export const scanFileWithVirusTotal = async (file: File, apiKey: string): Promise<any> => {
  try {
    // Step 1: Get upload URL
    const urlResponse = await fetch('https://www.virustotal.com/vtapi/v2/files/upload_url', {
      headers: {
        'x-apikey': apiKey
      }
    });
    const { upload_url } = await urlResponse.json();

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
    const { data: { id } } = await uploadResponse.json();

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
  } catch (error) {
    console.error('VirusTotal API Error:', error);
    throw error;
  }
};

