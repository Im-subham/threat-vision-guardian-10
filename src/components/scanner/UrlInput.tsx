
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
      // Basic URL validation
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
    <div className="border rounded-lg p-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-md bg-primary/10">
            <Link className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-medium">Scan URL</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <Input
            type="text"
            placeholder="Enter URL to scan (e.g., https://example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isScanning}
            className="flex-1"
          />
          <Button type="submit" disabled={isScanning || !url}>
            Scan URL
          </Button>
        </form>
        
        <p className="text-sm text-muted-foreground">
          Enter any suspicious URL to check for potential security threats
        </p>
      </div>
    </div>
  );
};

export default UrlInput;
