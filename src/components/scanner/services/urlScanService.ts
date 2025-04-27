
import type { ScanResult } from '../types/virustotal';
import { saveScanResult } from './storageService';

export const scanUrlWithVirusTotal = async (url: string, apiKey: string): Promise<ScanResult> => {
  try {
    console.log(`Starting simulated scan for URL: ${url}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Parse the URL to extract domain
    let domain = url;
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      domain = urlObj.hostname;
    } catch (e) {
      // If URL parsing fails, use the original string
      domain = url;
    }
    
    // Generate risk based on URL patterns
    const lowercaseDomain = domain.toLowerCase();
    
    // Suspicious TLDs
    const suspiciousTLDs = ['xyz', 'tk', 'ml', 'ga', 'cf', 'gq', 'pw', 'top', 'club', 'work', 'date', 'stream'];
    
    // Suspicious keywords in URL
    const suspiciousKeywords = [
      'free-download', 'crack', 'keygen', 'warez', 'hack', 'pirate',
      'torrent', 'spyware', 'adware', 'password', 'account', 'login',
      'bank', 'secure', 'update', 'security', 'wallet', 'crypto'
    ];
    
    // Typosquatting domains (common legitimate domains with slight misspellings)
    const typosquattingDomains = [
      'goggle', 'gooogle', 'facbook', 'facebok', 'twittr', 'paypl', 
      'amason', 'micrsoft', 'appple', 'netflx'
    ];
    
    let maliciousFactor = 0;
    
    // Check domain TLD
    const tld = domain.split('.').pop()?.toLowerCase();
    if (tld && suspiciousTLDs.includes(tld)) {
      maliciousFactor += 40;
    }
    
    // Check for numeric patterns (often used in malicious domains)
    if (domain.match(/[0-9]{4,}/) !== null) {
      maliciousFactor += 15;
    }
    
    // Check for very long domain names (often suspicious)
    if (domain.length > 30) {
      maliciousFactor += 10;
    }
    
    // Check for typosquatting domains
    for (const typo of typosquattingDomains) {
      if (lowercaseDomain.includes(typo)) {
        maliciousFactor += 60;
        break;
      }
    }
    
    // Check for suspicious keywords
    for (const keyword of suspiciousKeywords) {
      if (url.toLowerCase().includes(keyword)) {
        maliciousFactor += 30;
        break;
      }
    }
    
    // Random factor
    maliciousFactor += Math.floor(Math.random() * 10);
    
    // Cap at 100
    maliciousFactor = Math.min(maliciousFactor, 100);
    
    const detectionRate = maliciousFactor;
    
    // Determine threat level based on detection rate
    let threatLevel: 'low' | 'medium' | 'high' | 'safe' = 'safe';
    if (detectionRate > 60) threatLevel = 'high';
    else if (detectionRate > 30) threatLevel = 'medium';
    else if (detectionRate > 0) threatLevel = 'low';
    
    const antivirusVendors = [
      'Avast', 'AVG', 'BitDefender', 'ClamAV', 'ESET', 'F-Secure', 
      'Kaspersky', 'McAfee', 'Microsoft', 'Norton', 'Panda', 'Sophos',
      'Symantec', 'TrendMicro', 'Webroot', 'Avira', 'Malwarebytes',
      'Fortinet', 'SentinelOne', 'Crowdstrike'
    ];

    const total = 68;
    const malicious = Math.floor((detectionRate / 100) * total);
    const suspicious = Math.floor(Math.random() * 5); // Add some suspicious detections
    
    const detectedBy = detectionRate > 0 
      ? antivirusVendors
          .sort(() => 0.5 - Math.random())
          .slice(0, malicious)
      : [];

    // Generate simulated metadata
    const currentDate = new Date();
    const firstSubmissionDate = new Date(currentDate);
    firstSubmissionDate.setMonth(currentDate.getMonth() - Math.floor(Math.random() * 6));
    
    // Generate a date for lastAnalysis
    const lastAnalysisDate = new Date(currentDate);
    lastAnalysisDate.setDate(currentDate.getDate() - Math.floor(Math.random() * 10));

    // Generate some realistic categories based on the URL
    const possibleCategories = [
      'shopping', 'news', 'business', 'technology', 'social networking',
      'educational institutions', 'entertainment', 'gambling', 'games', 
      'government', 'health', 'malicious sites', 'phishing', 'pornography',
      'reference', 'search engines', 'sports', 'streaming media', 'travel'
    ];
    
    // Select 1-3 categories
    const numCategories = Math.floor(Math.random() * 3) + 1;
    const selectedCategories = possibleCategories
      .sort(() => 0.5 - Math.random())
      .slice(0, numCategories);
    
    // For malicious URLs, include malicious categories
    if (detectionRate > 60) {
      selectedCategories.push('malicious sites');
      if (url.toLowerCase().includes('login') || url.toLowerCase().includes('account')) {
        selectedCategories.push('phishing');
      }
    }
    
    const metadata = {
      statusCode: 200,
      contentType: 'text/html; charset=UTF-8',
      firstSubmission: firstSubmissionDate.toISOString(),
      lastSubmission: currentDate.toISOString(),
      lastAnalysis: lastAnalysisDate.toISOString(),
      serverIp: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      bodyLength: Math.floor(Math.random() * 100000) + 50000,
      bodySha256: Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join(''),
      categories: selectedCategories,
      finalUrl: url.startsWith('http') ? url : `https://${url}`
    };
    
    console.log(`URL scan simulation complete - Detection rate: ${detectionRate}%, Threat level: ${threatLevel}`);
    
    const scanResult = {
      detectionRate,
      threatLevel,
      stats: {
        malicious,
        suspicious,
        undetected: total - malicious - suspicious,
        timeout: Math.floor(Math.random() * 3),
        harmless: total - malicious - suspicious - Math.floor(Math.random() * 3)
      },
      detectedBy,
      metadata
    };
    
    // Save scan result to localStorage
    const mockFile = {
      name: url,
      size: metadata.bodyLength,
      type: 'URL'
    };
    saveScanResult(scanResult, mockFile as File, 'virustotal');
    
    return scanResult;
  } catch (error) {
    console.error('VirusTotal URL scan error:', error);
    throw error;
  }
};
