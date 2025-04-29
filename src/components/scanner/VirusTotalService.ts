
// Import the real URL scan service instead of the mock one
import { mockScanFileWithVirusTotal as scanFileWithVirusTotal } from './services/mockScanService';
import { scanUrlWithVirusTotal } from './services/urlScanService';

export { scanUrlWithVirusTotal, scanFileWithVirusTotal };
