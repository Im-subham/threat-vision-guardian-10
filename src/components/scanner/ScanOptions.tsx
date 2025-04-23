
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export type ScanEngine = 'virustotal' | 'ml' | 'both';

interface ScanOptionsProps {
  selectedEngine: ScanEngine;
  onEngineChange: (engine: ScanEngine) => void;
  disabled: boolean;
}

const ScanOptions = ({ selectedEngine, onEngineChange, disabled }: ScanOptionsProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Scan Options</CardTitle>
        <CardDescription>
          Select which scanning engine to use for malware detection
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedEngine}
          onValueChange={(value) => onEngineChange(value as ScanEngine)}
          className="space-y-4"
          disabled={disabled}
        >
          <div className="flex items-start space-x-3">
            <RadioGroupItem value="virustotal" id="virustotal" />
            <div className="grid gap-1.5">
              <Label htmlFor="virustotal" className="font-medium">
                VirusTotal API
              </Label>
              <p className="text-sm text-muted-foreground">
                Uses VirusTotal's database of 70+ antivirus engines for comprehensive threat detection.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <RadioGroupItem value="ml" id="ml" />
            <div className="grid gap-1.5">
              <Label htmlFor="ml" className="font-medium">
                Machine Learning Model
              </Label>
              <p className="text-sm text-muted-foreground">
                Uses our proprietary AI model to detect unknown or zero-day malware.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <RadioGroupItem value="both" id="both" />
            <div className="grid gap-1.5">
              <Label htmlFor="both" className="font-medium">
                Both Engines (Recommended)
              </Label>
              <p className="text-sm text-muted-foreground">
                Combines both methods for maximum security and comprehensive threat detection.
              </p>
            </div>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default ScanOptions;
