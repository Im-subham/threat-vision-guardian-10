
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StatCards from '@/components/dashboard/StatCards';
import RecentScans from '@/components/dashboard/RecentScans';
import EnginePieChart from '@/components/dashboard/EnginePieChart';
import DetectionBarChart from '@/components/dashboard/DetectionBarChart';
import { ScanResultData } from '@/components/scanner/ScanResult';
import { DashboardStats } from '@/components/dashboard/StatCards';

const Dashboard = () => {
  // Mocked scan history data for demonstration
  const [scanHistory, setScanHistory] = useState<ScanResultData[]>([
    {
      fileName: 'document.pdf',
      fileSize: 2.5 * 1024 * 1024,
      fileType: 'PDF Document',
      scanEngine: 'virustotal',
      isInfected: false,
      threatLevel: 'safe',
      detectionRate: 0,
      engineResults: {
        virustotal: {
          positives: 0,
          total: 68,
          detectedBy: []
        }
      },
      scanDate: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
    },
    {
      fileName: 'suspicious_file.exe',
      fileSize: 4.7 * 1024 * 1024,
      fileType: 'Windows Executable',
      scanEngine: 'both',
      isInfected: true,
      threatLevel: 'high',
      detectionRate: 85,
      engineResults: {
        virustotal: {
          positives: 58,
          total: 68,
          detectedBy: ['Avast', 'Kaspersky', 'Norton', 'McAfee', 'Microsoft']
        },
        ml: {
          confidence: 95,
          malwareType: 'Trojan',
          isInfected: true
        }
      },
      scanDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
      fileName: 'presentation.pptx',
      fileSize: 8.1 * 1024 * 1024,
      fileType: 'PowerPoint Presentation',
      scanEngine: 'ml',
      isInfected: false,
      threatLevel: 'safe',
      engineResults: {
        ml: {
          confidence: 98,
          isInfected: false
        }
      },
      scanDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    },
    {
      fileName: 'script.js',
      fileSize: 0.3 * 1024 * 1024,
      fileType: 'JavaScript File',
      scanEngine: 'both',
      isInfected: true,
      threatLevel: 'medium',
      detectionRate: 45,
      engineResults: {
        virustotal: {
          positives: 31,
          total: 68,
          detectedBy: ['Avast', 'BitDefender', 'Avira']
        },
        ml: {
          confidence: 65,
          malwareType: 'Potentially Unwanted Program',
          isInfected: true
        }
      },
      scanDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
    },
    {
      fileName: 'image.png',
      fileSize: 1.2 * 1024 * 1024,
      fileType: 'PNG Image',
      scanEngine: 'virustotal',
      isInfected: false,
      threatLevel: 'safe',
      detectionRate: 0,
      engineResults: {
        virustotal: {
          positives: 0,
          total: 68,
          detectedBy: []
        }
      },
      scanDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
    }
  ]);

  // Calculate dashboard stats from scan history
  const [stats, setStats] = useState<DashboardStats>({
    totalScans: 0,
    maliciousFiles: 0,
    cleanFiles: 0,
    lastScanDate: null
  });

  // Calculate engine usage stats
  const [engineStats, setEngineStats] = useState({
    virusTotalScans: 0,
    mlScans: 0,
    bothScans: 0
  });

  // Monthly detection history data
  const [detectionHistory, setDetectionHistory] = useState([
    { name: 'Jan', clean: 12, infected: 3 },
    { name: 'Feb', clean: 19, infected: 4 },
    { name: 'Mar', clean: 15, infected: 2 },
    { name: 'Apr', clean: 18, infected: 1 },
    { name: 'May', clean: 14, infected: 5 },
    { name: 'Jun', clean: 21, infected: 3 }
  ]);

  // Calculate stats whenever scan history changes
  useEffect(() => {
    if (scanHistory.length > 0) {
      // Sort scan history by date (newest first)
      const sortedHistory = [...scanHistory].sort((a, b) => 
        b.scanDate.getTime() - a.scanDate.getTime()
      );

      const maliciousCount = sortedHistory.filter(scan => scan.isInfected).length;
      
      setStats({
        totalScans: sortedHistory.length,
        maliciousFiles: maliciousCount,
        cleanFiles: sortedHistory.length - maliciousCount,
        lastScanDate: sortedHistory[0].scanDate
      });

      // Calculate engine stats
      const virusTotalCount = sortedHistory.filter(scan => scan.scanEngine === 'virustotal').length;
      const mlCount = sortedHistory.filter(scan => scan.scanEngine === 'ml').length;
      const bothCount = sortedHistory.filter(scan => scan.scanEngine === 'both').length;

      setEngineStats({
        virusTotalScans: virusTotalCount,
        mlScans: mlCount,
        bothScans: bothCount
      });
    }
  }, [scanHistory]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Security Dashboard</h1>
          <StatCards stats={stats} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <EnginePieChart 
              virusTotalScans={engineStats.virusTotalScans}
              mlScans={engineStats.mlScans}
              bothScans={engineStats.bothScans}
            />
            <DetectionBarChart data={detectionHistory} />
          </div>
          
          <RecentScans scans={scanHistory} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
