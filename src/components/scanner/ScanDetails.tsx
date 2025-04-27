
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, ShieldX, Globe } from 'lucide-react';
import ThreatLevelBadge from './ThreatLevelBadge';
import type { ScanResultData } from './types';

interface ScanDetailsProps {
  result: ScanResultData;
}

const ScanDetails = ({ result }: ScanDetailsProps) => {
  const isUrl = result.fileType === 'URL';
  const metadata = result.engineResults?.virustotal?.metadata;
  
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
              This {isUrl ? 'URL' : 'file'} contains malicious content
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-threat-safe/20 mb-4">
              <ShieldCheck className="h-10 w-10 text-threat-safe" />
            </div>
            <h3 className="text-xl font-bold text-threat-safe mb-1">
              {isUrl ? 'URL is Safe' : 'File is Safe'}
            </h3>
            <p className="text-sm text-muted-foreground">
              No security vendors flagged this {isUrl ? 'URL' : 'file'} as malicious
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-semibold mb-3">{isUrl ? 'URL Information' : 'File Information'}</h4>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-muted-foreground text-sm">{isUrl ? 'URL:' : 'Name:'}</dt>
              <dd className="text-sm font-medium truncate max-w-[200px]">
                {isUrl ? metadata?.finalUrl || result.fileName : result.fileName}
              </dd>
            </div>
            {isUrl && metadata?.statusCode && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground text-sm">Status Code:</dt>
                <dd className="text-sm font-medium">
                  {metadata.statusCode}
                </dd>
              </div>
            )}
            {isUrl && metadata?.contentType && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground text-sm">Content Type:</dt>
                <dd className="text-sm font-medium">
                  {metadata.contentType}
                </dd>
              </div>
            )}
            {isUrl && metadata?.serverIp && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground text-sm">Server IP:</dt>
                <dd className="text-sm font-medium">
                  {metadata.serverIp}
                </dd>
              </div>
            )}
            {isUrl && metadata?.categories && metadata.categories.length > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground text-sm">Categories:</dt>
                <dd className="text-sm font-medium">
                  {metadata.categories.join(', ')}
                </dd>
              </div>
            )}
            {!isUrl && (
              <>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground text-sm">Type:</dt>
                  <dd className="text-sm font-medium">{result.fileType}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground text-sm">Size:</dt>
                  <dd className="text-sm font-medium">{formatFileSize(result.fileSize)}</dd>
                </div>
              </>
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
                <ThreatLevelBadge level={result.threatLevel || 'safe'} />
              </dd>
            </div>
            {metadata?.lastAnalysis && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground text-sm">Last Analysis:</dt>
                <dd className="text-sm font-medium">
                  {formatDate(metadata.lastAnalysis)}
                </dd>
              </div>
            )}
            {metadata?.firstSubmission && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground text-sm">First Seen:</dt>
                <dd className="text-sm font-medium">
                  {formatDate(metadata.firstSubmission)}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 7) {
    return `${diffDays} days ago`;
  }
  
  return date.toLocaleDateString();
};

export default ScanDetails;
