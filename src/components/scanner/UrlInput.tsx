
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'lucide-react';
import { toast } from 'sonner';

interface UrlInputProps {
  onUrlSubmitted: (url: string) => void;
  isScanning: boolean;
}

const UrlInput = ({ onUrlSubmitted, isScanning }: UrlInputProps) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      new URL(url);
      onUrlSubmitted(url);
      setUrl('');
    } catch {
      toast.error('Invalid URL', {
        description: 'Please enter a valid URL (e.g., https://example.com)'
      });
    }
  };

  return (
    <div className="border border-gray-600 rounded-lg p-6 bg-[#1E1F25]">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Link className="h-5 w-5 text-[#3367d6]" />
          </div>
          <Input
            type="text"
            placeholder="Enter URL to scan (e.g., https://example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isScanning}
            className="pl-10 bg-[#14151A] border-gray-600 text-white placeholder:text-gray-500"
          />
        </div>
        <Button 
          type="submit" 
          disabled={isScanning || !url}
          className="bg-[#3367d6] hover:bg-[#3367d6]/90 text-white px-8 py-2"
        >
          Scan URL
        </Button>
      </form>
    </div>
  );
};

export default UrlInput;
