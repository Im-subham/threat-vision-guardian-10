
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScanInterface from '@/components/scanner/ScanInterface';
import { useScanOperation } from '@/hooks/useScanOperation';

const ScanPage = () => {
  const {
    selectedFile,
    setSelectedFile,
    selectedUrl,
    setSelectedUrl,
    isScanning,
    scanProgress,
    scanResult,
    handleStartScan,
    handleNewScan
  } = useScanOperation();

  return (
    <div className="min-h-screen flex flex-col bg-[#14151A] text-white">
      <Navbar />
      <div className="flex-1 pt-16">
        <div className="container mx-auto px-4 py-12">
          <ScanInterface
            selectedFile={selectedFile}
            selectedUrl={selectedUrl}
            isScanning={isScanning}
            scanProgress={scanProgress}
            scanResult={scanResult}
            onFileSelected={setSelectedFile}
            onUrlSubmitted={setSelectedUrl}
            onStartScan={handleStartScan}
            onNewScan={handleNewScan}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ScanPage;
