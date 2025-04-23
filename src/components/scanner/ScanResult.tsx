
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ShieldCheck, ShieldX, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    };
    ml?: {
      confidence: number;
      malwareType?: string;
      isInfected: boolean;
    };
  };
  scanDate: Date;
}

interface ScanResultProps {
  result: ScanResultData | null;
  isScanning: boolean;
  scanProgress: number;
  onNewScan: () => void;
}

const ScanResult = ({ result, isScanning, scanProgress, onNewScan }: ScanResultProps) => {
  if (!result && !isScanning) {
    return null;
  }

  const renderThreatLevel = (level?: string) => {
    switch (level) {
      case 'low':
        return (
          <Badge variant="outline" className="bg-threat-low/20 text-threat-low border-threat-low">
            Low Risk
          </Badge>
        );
      case 'medium':
        return (
          <Badge variant="outline" className="bg-threat-medium/20 text-threat-medium border-threat-medium">
            Medium Risk
          </Badge>
        );
      case 'high':
        return (
          <Badge variant="outline" className="bg-threat-high/20 text-threat-high border-threat-high">
            High Risk
          </Badge>
        );
      case 'safe':
      default:
        return (
          <Badge variant="outline" className="bg-threat-safe/20 text-threat-safe border-threat-safe">
            Safe
          </Badge>
        );
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Scan Results</span>
          {result && !isScanning && (
            <Button variant="outline" size="sm" onClick={onNewScan}>
              New Scan
            </Button>
          )}
        </CardTitle>
        {isScanning ? (
          <CardDescription>
            Analyzing file for malicious content...
          </CardDescription>
        ) : (
          result && (
            <CardDescription>
              File scanned on {result.scanDate.toLocaleString()}
            </CardDescription>
          )
        )}
      </CardHeader>
      <CardContent>
        {isScanning ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Scan progress</span>
              <span className="text-sm text-muted-foreground">{scanProgress}%</span>
            </div>
            <Progress value={scanProgress} className="h-2" />
            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
                <div 
                  className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin"
                  style={{ animationDuration: '1.5s' }}
                ></div>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                {scanProgress < 30 
                  ? "Initializing scan..." 
                  : scanProgress < 70 
                    ? "Analyzing file patterns..." 
                    : "Comparing with threat database..."}
              </p>
            </div>
          </div>
        ) : result && (
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
                    <dd className="text-sm font-medium">{renderThreatLevel(result.threatLevel)}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {result.engineResults && (
              <>
                <div className="h-px bg-border my-4" />
                
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold">Detailed Results</h4>
                  
                  {result.engineResults.virustotal && (
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium mb-3">VirusTotal Results</h5>
                      <div className="flex items-center mb-4">
                        <div className="w-full">
                          <div className="flex justify-between mb-1">
                            <span className="text-xs text-muted-foreground">Detection Rate</span>
                            <span className="text-xs font-medium">
                              {result.engineResults.virustotal.positives} / {result.engineResults.virustotal.total} engines
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-2 rounded-full ${
                                result.isInfected ? 'bg-threat-high' : 'bg-threat-safe'
                              }`}
                              style={{ 
                                width: `${(result.engineResults.virustotal.positives / result.engineResults.virustotal.total) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      {result.engineResults.virustotal.detectedBy.length > 0 && (
                        <div>
                          <h6 className="text-sm mb-2">Detected By:</h6>
                          <div className="flex flex-wrap gap-2">
                            {result.engineResults.virustotal.detectedBy.map((engine, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">{engine}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {result.engineResults.ml && (
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium mb-3">ML Model Results</h5>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-xs text-muted-foreground">Confidence</span>
                            <span className="text-xs font-medium">{result.engineResults.ml.confidence}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-2 rounded-full ${
                                result.engineResults.ml.isInfected ? 'bg-threat-high' : 'bg-threat-safe'
                              }`}
                              style={{ width: `${result.engineResults.ml.confidence}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Assessment:</span>
                          <span className="text-sm font-medium flex items-center">
                            {result.engineResults.ml.isInfected ? (
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
                        
                        {result.engineResults.ml.malwareType && (
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Type:</span>
                            <span className="text-sm font-medium">
                              {result.engineResults.ml.malwareType}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="flex justify-center pt-4">
              <Button variant="outline" onClick={onNewScan}>
                Scan Another File
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScanResult;
