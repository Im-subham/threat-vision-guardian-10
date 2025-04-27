
import React from 'react';
import type { ScanResultData } from './types';

interface EngineResultsProps {
  engineResults: NonNullable<ScanResultData['engineResults']>;
}

const EngineResults = ({ engineResults }: EngineResultsProps) => {
  if (!engineResults.virustotal) return null;

  const detectionRate = engineResults.virustotal 
    ? ((engineResults.virustotal.positives / engineResults.virustotal.total) * 100).toFixed(1)
    : '0';

  return (
    <div className="w-full">
      <div className="flex items-center mb-4">
        <div className="w-full">
          <div className="flex justify-between mb-1">
            <span className="text-xs text-muted-foreground">Detection Rate</span>
            <span className="text-xs font-medium">
              {detectionRate}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className={`h-2 rounded-full ${
                Number(detectionRate) > 10 ? 'bg-threat-high' : 'bg-threat-safe'
              }`}
              style={{ 
                width: `${detectionRate}%` 
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngineResults;
