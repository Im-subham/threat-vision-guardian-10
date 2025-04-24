
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ScanProgressProps {
  progress: number;
}

const ScanProgress = ({ progress }: ScanProgressProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Scan progress</span>
        <span className="text-sm text-muted-foreground">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="flex flex-col items-center justify-center py-8">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
          <div 
            className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin"
            style={{ animationDuration: '1.5s' }}
          ></div>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          {progress < 30 
            ? "Initializing scan..." 
            : progress < 70 
              ? "Analyzing file patterns..." 
              : "Comparing with threat database..."}
        </p>
      </div>
    </div>
  );
};

export default ScanProgress;
