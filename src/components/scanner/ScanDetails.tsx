
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, ShieldX } from 'lucide-react';
import ThreatLevelBadge from './ThreatLevelBadge';
import type { ScanResultData } from './types';

interface ScanDetailsProps {
  result: ScanResultData;
}

const ScanDetails = ({ result }: ScanDetailsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center py-6">
        {result.isInfected ? (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-threat-high/20 mb-4">
              <ShieldX className="h-10 w-10 text-threat-high" />
            </div>
            <h3 className="text-xl font-bold text-threat-high mb-1">Threat Detected</h3>
            <p className="text-sm text-muted-foreground">
              This file contains malicious content
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-threat-safe/20 mb-4">
              <ShieldCheck className="h-10 w-10 text-threat-safe" />
            </div>
            <h3 className="text-xl font-bold text-threat-safe mb-1">File is Safe</h3>
            <p className="text-sm text-muted-foreground">
              No malware or suspicious content detected
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-semibold mb-3">File Information</h4>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-muted-foreground text-sm">Name:</dt>
              <dd className="text-sm font-medium truncate max-w-[200px]">{result.fileName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground text-sm">Size:</dt>
              <dd className="text-sm font-medium">{(result.fileSize / 1024 / 1024).toFixed(2)} MB</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground text-sm">Type:</dt>
              <dd className="text-sm font-medium">{result.fileType}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground text-sm">Scan Engine:</dt>
              <dd className="text-sm font-medium capitalize">{result.scanEngine}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">Threat Assessment</h4>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-muted-foreground text-sm">Status:</dt>
              <dd className="text-sm font-medium">
                {result.isInfected ? (
                  <span className="text-threat-high">Infected</span>
                ) : (
                  <span className="text-threat-safe">Clean</span>
                )}
              </dd>
            </div>
            {result.detectionRate !== undefined && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground text-sm">Detection Rate:</dt>
                <dd className="text-sm font-medium">{result.detectionRate}%</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted-foreground text-sm">Threat Level:</dt>
              <dd className="text-sm font-medium">
                <ThreatLevelBadge level={result.threatLevel} />
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default ScanDetails;
