// src/components/ui/ImagePreviewModal.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { useState } from 'react';

interface ImagePreviewModalProps {
  imageUrl: string;
  onClose: () => void;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ imageUrl, onClose }) => {
  const [scale, setScale] = useState(1);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `payment-proof-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-7xl max-h-[90vh] w-full">
        {/* Controls */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={handleZoomIn}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={handleZoomOut}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={handleDownload}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Image */}
        <div className="overflow-auto max-h-[85vh]">
          <img
            src={imageUrl}
            alt="Preview"
            className="mx-auto rounded-lg shadow-2xl"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'center'
            }}
          />
        </div>

        {/* Zoom Info */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
          {Math.round(scale * 100)}%
        </div>
      </div>
    </div>
  );
};