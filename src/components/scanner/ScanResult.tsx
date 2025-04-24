
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ScanResultProps } from './types';
import ScanProgress from './ScanProgress';
import ScanDetails from './ScanDetails';
import EngineResults from './EngineResults';

const ScanResult = ({ result, isScanning, scanProgress, onNewScan }: ScanResultProps) => {
  if (!result && !isScanning) {
    return null;
  }

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
          <ScanProgress progress={scanProgress} />
        ) : result && (
          <>
            <ScanDetails result={result} />
            
            {result.engineResults && (
              <>
                <div className="h-px bg-border my-4" />
                <EngineResults engineResults={result.engineResults} />
              </>
            )}

            <div className="flex justify-center pt-4">
              <Button variant="outline" onClick={onNewScan}>
                Scan Another File
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ScanResult;
