
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { ScanResultData } from './types';

interface EngineResultsProps {
  engineResults: NonNullable<ScanResultData['engineResults']>;
}

const EngineResults = ({ engineResults }: EngineResultsProps) => {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold">Detailed Results</h4>
      
      {engineResults.virustotal && (
        <div className="border rounded-lg p-4">
          <h5 className="font-medium mb-3">VirusTotal Results</h5>
          <div className="flex items-center mb-4">
            <div className="w-full">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-muted-foreground">Detection Rate</span>
                <span className="text-xs font-medium">
                  {engineResults.virustotal.positives} / {engineResults.virustotal.total} engines
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-2 rounded-full ${
                    engineResults.virustotal.positives > 0 ? 'bg-threat-high' : 'bg-threat-safe'
                  }`}
                  style={{ 
                    width: `${(engineResults.virustotal.positives / engineResults.virustotal.total) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
          
          {engineResults.virustotal.detectedBy.length > 0 && (
            <div>
              <h6 className="text-sm mb-2">Detected By:</h6>
              <div className="flex flex-wrap gap-2">
                {engineResults.virustotal.detectedBy.map((engine, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">{engine}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {engineResults.ml && (
        <div className="border rounded-lg p-4">
          <h5 className="font-medium mb-3">ML Model Results</h5>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-muted-foreground">Confidence</span>
                <span className="text-xs font-medium">{engineResults.ml.confidence}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-2 rounded-full ${
                    engineResults.ml.isInfected ? 'bg-threat-high' : 'bg-threat-safe'
                  }`}
                  style={{ width: `${engineResults.ml.confidence}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Assessment:</span>
              <span className="text-sm font-medium flex items-center">
                {engineResults.ml.isInfected ? (
                  <>
                    <XCircle className="h-4 w-4 text-threat-high mr-1" />
                    Malicious
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-threat-safe mr-1" />
                    Benign
                  </>
                )}
              </span>
            </div>
            
            {engineResults.ml.malwareType && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Type:</span>
                <span className="text-sm font-medium">
                  {engineResults.ml.malwareType}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EngineResults;
