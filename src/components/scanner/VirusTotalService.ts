
// Export the mock services instead of the real ones
import { mockScanUrlWithVirusTotal as scanUrlWithVirusTotal } from './services/mockScanService';
import { mockScanFileWithVirusTotal as scanFileWithVirusTotal } from './services/mockScanService';

export { scanUrlWithVirusTotal, scanFileWithVirusTotal };
