
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, ShieldX, FileText } from 'lucide-react';
import { ScanResultData } from '../scanner/ScanResult';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface RecentScansProps {
  scans: ScanResultData[];
}

const RecentScans = ({ scans }: RecentScansProps) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    else return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Recent Scans</CardTitle>
            <CardDescription>Your latest file scans and their results</CardDescription>
          </div>
          <Button asChild size="sm">
            <Link to="/scan">New Scan</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {scans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mb-3 opacity-40" />
            <p className="text-muted-foreground">No scan history available</p>
            <p className="text-sm text-muted-foreground mt-1">Upload and scan your first file</p>
            <Button asChild className="mt-4">
              <Link to="/scan">Start Scanning</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left font-medium px-4 py-3">File</th>
                  <th className="text-left font-medium px-4 py-3">Type</th>
                  <th className="text-left font-medium px-4 py-3">Size</th>
                  <th className="text-left font-medium px-4 py-3">Scan Engine</th>
                  <th className="text-left font-medium px-4 py-3">Date</th>
                  <th className="text-left font-medium px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {scans.map((scan, index) => (
                  <tr 
                    key={index} 
                    className={`${index !== scans.length - 1 ? 'border-b' : ''} hover:bg-muted/50`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="mr-2 p-2 rounded-full bg-muted">
                          <FileText className="h-4 w-4" />
                        </div>
                        <span className="truncate max-w-[150px]" title={scan.fileName}>
                          {scan.fileName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{scan.fileType}</td>
                    <td className="px-4 py-3">{formatFileSize(scan.fileSize)}</td>
                    <td className="px-4 py-3 capitalize">{scan.scanEngine}</td>
                    <td className="px-4 py-3">
                      {scan.scanDate.toLocaleDateString()} {scan.scanDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-3">
                      {scan.isInfected ? (
                        <Badge variant="outline" className="gap-1 bg-threat-high/20 text-threat-high border-threat-high">
                          <ShieldX className="h-3 w-3" />
                          <span>Infected</span>
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1 bg-threat-safe/20 text-threat-safe border-threat-safe">
                          <ShieldCheck className="h-3 w-3" />
                          <span>Clean</span>
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentScans;
