
export interface VirusTotalResponse {
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

export interface ScanResult {
  detectionRate: number;
  threatLevel: 'low' | 'medium' | 'high' | 'safe';
  stats: {
    malicious: number;
    suspicious: number;
    undetected: number;
    timeout?: number;
    harmless?: number;
  };
  detectedBy: string[];
  metadata?: {
    statusCode: number;
    contentType: string;
    firstSubmission?: string;
    lastSubmission?: string;
    lastAnalysis?: string;
    serverIp?: string;
    bodyLength?: number;
    bodySha256?: string;
    categories?: string[];
    finalUrl?: string;
  };
}

