import React, { useState } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  isScanning: boolean;
}

const FileUpload = ({ onFileSelected, isScanning }: FileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const maxFileSize = 50 * 1024 * 1024; // 50MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    if (file.size > maxFileSize) {
      toast.error('File too large', {
        description: 'Maximum file size is 50MB'
      });
      return;
    }

    setSelectedFile(file);
    simulateUploadProgress(file);
    onFileSelected(file);
  };

  const simulateUploadProgress = (file: File) => {
    setUploadProgress(0);
    const totalSize = file.size;
    const chunkSize = totalSize / 10;
    let loadedSize = 0;
    
    const interval = setInterval(() => {
      loadedSize += chunkSize;
      const newProgress = Math.min(Math.round((loadedSize / totalSize) * 100), 100);
      setUploadProgress(newProgress);
      
      if (newProgress >= 100) {
        clearInterval(interval);
      }
    }, 150);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            isDragging ? 'border-[#3367d6] bg-[#3367d6]/5' : 'border-gray-600'
          } transition-colors duration-200 bg-[#1E1F25]`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-24 h-24 mb-6 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Upload className="h-12 w-12 text-[#3367d6]" />
              </div>
              <div className="absolute inset-0 border-4 border-[#3367d6]/30 rounded-lg"></div>
            </div>
            <Button
              type="button"
              onClick={() => document.getElementById('file-upload')?.click()}
              className="bg-[#3367d6] hover:bg-[#3367d6]/90 text-white px-8 py-2 rounded"
              disabled={isScanning}
            >
              Choose file
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={handleFileChange}
                disabled={isScanning}
              />
            </Button>
            <p className="text-sm text-gray-400 mt-4">
              Maximum file size: 50MB
            </p>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-primary/10 mr-3">
                <Upload className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium truncate max-w-[200px] sm:max-w-sm">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            {!isScanning && (
              <Button
                size="icon"
                variant="ghost"
                onClick={removeSelectedFile}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {uploadProgress < 100 ? (
            <>
              <Progress value={uploadProgress} className="h-2 mb-2" />
              <p className="text-xs text-right text-muted-foreground">{uploadProgress}% uploaded</p>
            </>
          ) : (
            <div className="flex items-center text-sm text-threat-safe">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span>File ready for scanning</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
