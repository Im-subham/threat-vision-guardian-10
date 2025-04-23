
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import FileUpload from './FileUpload';
import UrlInput from './UrlInput';
import ScanResult from './ScanResult';

interface ScanInterfaceProps {
  selectedFile: File | null;
  selectedUrl: string | null;
  isScanning: boolean;
  scanProgress: number;
  scanResult: any;
  onFileSelected: (file: File) => void;
  onUrlSubmitted: (url: string) => void;
  onStartScan: () => void;
  onNewScan: () => void;
}

const ScanInterface: React.FC<ScanInterfaceProps> = ({
  selectedFile,
  selectedUrl,
  isScanning,
  scanProgress,
  scanResult,
  onFileSelected,
  onUrlSubmitted,
  onStartScan,
  onNewScan
}) => {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <img 
        src="/lovable-uploads/578e1dcf-aaef-4393-9807-6c48f3105905.png" 
        alt="VirusTotal Logo" 
        className="h-16 mx-auto mb-6"
      />
      <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
        Analyze suspicious files, domains, IPs and URLs to detect malware and other
        breaches, automatically share them with the security community.
      </p>

      <Tabs defaultValue="file" className="w-full">
        <TabsList className="w-full max-w-md grid grid-cols-3 h-12 mb-8 bg-[#1E1F25]">
          <TabsTrigger 
            value="file"
            className="text-lg data-[state=active]:bg-[#3367d6] data-[state=active]:text-white"
          >
            FILE
          </TabsTrigger>
          <TabsTrigger 
            value="url"
            className="text-lg data-[state=active]:bg-[#3367d6] data-[state=active]:text-white"
          >
            URL
          </TabsTrigger>
          <TabsTrigger 
            value="search"
            className="text-lg data-[state=active]:bg-[#3367d6] data-[state=active]:text-white"
          >
            SEARCH
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file" className="mt-0">
          <FileUpload 
            onFileSelected={onFileSelected}
            isScanning={isScanning}
          />
        </TabsContent>

        <TabsContent value="url" className="mt-0">
          <UrlInput 
            onUrlSubmitted={onUrlSubmitted}
            isScanning={isScanning}
          />
        </TabsContent>

        <TabsContent value="search" className="mt-0">
          <div className="text-center py-12 text-gray-400">
            Search functionality coming soon
          </div>
        </TabsContent>
      </Tabs>

      {(selectedFile || selectedUrl) && !isScanning && !scanResult && (
        <div className="mt-6 flex justify-center">
          <Button 
            onClick={onStartScan} 
            disabled={isScanning}
            className="bg-[#3367d6] hover:bg-[#3367d6]/90 text-white px-8 py-2 rounded"
          >
            Start Scan
          </Button>
        </div>
      )}

      <ScanResult 
        result={scanResult}
        isScanning={isScanning}
        scanProgress={scanProgress}
        onNewScan={onNewScan}
      />

      <div className="mt-8 text-sm text-gray-500">
        <p>
          By submitting data above, you are agreeing to our Terms of Service and Privacy Notice, 
          and to the sharing of your submission with the security community.
        </p>
        <p className="mt-2">
          Please do not submit any personal information; we are not responsible for the contents of your submission.
        </p>
      </div>
    </div>
  );
};

export default ScanInterface;
