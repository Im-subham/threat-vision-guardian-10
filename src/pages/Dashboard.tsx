
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
  // State for scan history from localStorage
  const [scanHistory, setScanHistory] = useState<ScanResultData[]>([]);
  
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
  const [detectionHistory, setDetectionHistory] = useState<{ name: string; clean: number; infected: number; }[]>([]);

  // Load scan history from localStorage on component mount
  useEffect(() => {
    const storedScanHistory = localStorage.getItem('scanHistory');
    if (storedScanHistory) {
      try {
        const parsedHistory = JSON.parse(storedScanHistory);
        
        // Convert string dates back to Date objects
        const processedHistory: ScanResultData[] = parsedHistory.map((scan: any) => ({
          ...scan,
          scanDate: new Date(scan.scanDate)
        }));
        
        setScanHistory(processedHistory);
      } catch (error) {
        console.error('Failed to parse scan history:', error);
        setScanHistory([]);
      }
    }
  }, []);

  // Generate monthly detection data based on actual scan history
  useEffect(() => {
    if (scanHistory.length > 0) {
      // Get the last 6 months
      const months = [];
      const today = new Date();
      for (let i = 5; i >= 0; i--) {
        const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
        months.push({
          name: month.toLocaleString('default', { month: 'short' }),
          month: month.getMonth(),
          year: month.getFullYear()
        });
      }
      
      // Count scans by month
      const monthlyData = months.map(monthData => {
        const monthScans = scanHistory.filter(scan => {
          const scanMonth = scan.scanDate.getMonth();
          const scanYear = scan.scanDate.getFullYear();
          return scanMonth === monthData.month && scanYear === monthData.year;
        });
        
        const clean = monthScans.filter(scan => !scan.isInfected).length;
        const infected = monthScans.filter(scan => scan.isInfected).length;
        
        return {
          name: monthData.name,
          clean,
          infected
        };
      });
      
      setDetectionHistory(monthlyData);
    } else {
      // If no scan history, set empty data for all months
      const emptyMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(month => ({
        name: month,
        clean: 0,
        infected: 0
      }));
      setDetectionHistory(emptyMonths);
    }
  }, [scanHistory]);

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
