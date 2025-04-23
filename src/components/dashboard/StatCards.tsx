
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, ShieldX, AlertCircle, Clock } from 'lucide-react';

export interface DashboardStats {
  totalScans: number;
  maliciousFiles: number;
  cleanFiles: number;
  lastScanDate: Date | null;
}

interface StatCardsProps {
  stats: DashboardStats;
}

const StatCards = ({ stats }: StatCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Scans</CardDescription>
          <CardTitle className="text-2xl">{stats.totalScans}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground text-sm">
              All-time scans
            </div>
            <div className="p-2 bg-primary/10 rounded-full">
              <Clock className="h-4 w-4 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Clean Files</CardDescription>
          <CardTitle className="text-2xl">{stats.cleanFiles}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground text-sm">
              {stats.totalScans > 0 
                ? `${Math.round((stats.cleanFiles / stats.totalScans) * 100)}% of total`
                : 'No scans yet'}
            </div>
            <div className="p-2 bg-threat-safe/10 rounded-full">
              <ShieldCheck className="h-4 w-4 text-threat-safe" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Malicious Files</CardDescription>
          <CardTitle className="text-2xl">{stats.maliciousFiles}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground text-sm">
              {stats.totalScans > 0 
                ? `${Math.round((stats.maliciousFiles / stats.totalScans) * 100)}% of total`
                : 'No scans yet'}
            </div>
            <div className="p-2 bg-threat-high/10 rounded-full">
              <ShieldX className="h-4 w-4 text-threat-high" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Last Scan</CardDescription>
          <CardTitle className="text-2xl">
            {stats.lastScanDate 
              ? new Intl.DateTimeFormat('en-US', { 
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }).format(stats.lastScanDate)
              : 'N/A'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground text-sm">
              {stats.lastScanDate 
                ? `${Math.round((new Date().getTime() - stats.lastScanDate.getTime()) / (1000 * 60))} minutes ago`
                : 'No scans yet'}
            </div>
            <div className="p-2 bg-primary/10 rounded-full">
              <AlertCircle className="h-4 w-4 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards;
