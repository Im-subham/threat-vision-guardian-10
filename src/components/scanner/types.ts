
import { ScanEngine } from './ScanOptions';

export interface ScanResultData {
  fileName: string;
  fileSize: number;
  fileType: string;
  scanEngine: ScanEngine;
  isInfected: boolean;
  detectionRate?: number;
  threatLevel?: 'low' | 'medium' | 'high' | 'safe';
  engineResults?: {
    virustotal?: {
      positives: number;
      total: number;
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
    };
    ml?: {
      confidence: number;
      malwareType?: string;
      isInfected: boolean;
    };
  };
  scanDate: Date;
}

export interface ScanResultProps {
  result: ScanResultData | null;
  isScanning: boolean;
  scanProgress: number;
  onNewScan: () => void;
}
