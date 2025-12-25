// src/components/manual-payment/user/ProofUploader.tsx
import React, { useCallback } from 'react';
import { Button } from '../../ui/button';
import { Upload, X } from 'lucide-react';

interface ProofUploaderProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  accept?: string;
}

export const ProofUploader: React.FC<ProofUploaderProps> = ({
  files,
  onFilesChange,
  maxFiles = 5,
  accept = 'image/*,.pdf'
}) => {
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    if (files.length + selectedFiles.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files`);
      return;
    }
    
    onFilesChange([...files, ...selectedFiles]);
    e.target.value = '';
  }, [files, maxFiles, onFilesChange]);

  const removeFile = useCallback((index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    onFilesChange(newFiles);
  }, [files, onFilesChange]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    
    if (files.length + droppedFiles.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files`);
      return;
    }
    
    onFilesChange([...files, ...droppedFiles]);
  }, [files, maxFiles, onFilesChange]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  return (
    <div className="space-y-3">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <Upload className="h-10 w-10 mx-auto text-gray-400 mb-3" />
        <p className="text-sm text-gray-600 mb-2">
          ফাইলগুলো এখানে ড্রপ করুন অথবা
        </p>
        <Button type="button" variant="outline" className="relative">
          ফাইল সিলেক্ট করুন
          <input
            type="file"
            multiple
            accept={accept}
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          PNG, JPG, PDF (সর্বোচ্চ {maxFiles} টি ফাইল, {maxFiles}MB প্রতিটি)
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            নির্বাচিত ফাইল ({files.length}/{maxFiles})
          </p>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1 truncate">
                  <p className="text-sm truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="ml-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};