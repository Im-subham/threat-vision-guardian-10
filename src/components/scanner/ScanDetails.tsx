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
          <h4 className="text-sm font-semibold mb-3">URL Information</h4>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-muted-foreground text-sm">URL:</dt>
              <dd className="text-sm font-medium truncate max-w-[200px]">
                {result.fileName}
              </dd>
            </div>
            {result.engineResults?.virustotal?.metadata?.statusCode && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground text-sm">Status Code:</dt>
                <dd className="text-sm font-medium">
                  {result.engineResults.virustotal.metadata.statusCode}
                </dd>
              </div>
            )}
            {result.engineResults?.virustotal?.metadata?.contentType && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground text-sm">Content Type:</dt>
                <dd className="text-sm font-medium">
                  {result.engineResults.virustotal.metadata.contentType}
                </dd>
              </div>
            )}
            {result.engineResults?.virustotal?.metadata?.categories && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground text-sm">Categories:</dt>
                <dd className="text-sm font-medium">
                  {result.engineResults.virustotal.metadata.categories.join(', ')}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">Scan Details</h4>
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
            {result.engineResults?.virustotal?.metadata?.lastAnalysis && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground text-sm">Last Analysis:</dt>
                <dd className="text-sm font-medium">
                  {new Date(result.engineResults.virustotal.metadata.lastAnalysis).toLocaleString()}
                </dd>
              </div>
            )}
            {result.engineResults?.virustotal?.metadata?.firstSubmission && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground text-sm">First Seen:</dt>
                <dd className="text-sm font-medium">
                  {new Date(result.engineResults.virustotal.metadata.firstSubmission).toLocaleString()}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default ScanDetails;
