'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { X, Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface ProductImagePanelProps {
  onImageUpload: (file: File | null) => void;
  initialImageUrl?: string;
}

export default function ProductImagePanel({ onImageUpload, initialImageUrl }: ProductImagePanelProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl || null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
      onImageUpload(file);
      setIsUploading(false);
    };
    reader.onerror = () => {
      setIsUploading(false);
      alert('Error reading file');
    };
    reader.readAsDataURL(file);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      handleImageFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    multiple: false
  });

  const handleClearImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setPreviewUrl(null);
    onImageUpload(null);
  };

  return (
    <div className="h-full flex flex-col bg-[#23243A] rounded-2xl p-6 text-white">
      <h2 className="text-lg font-semibold mb-4">Product photo</h2>
      
      <div className="flex space-x-2 mb-4">
        <button 
          className="px-4 py-2 text-sm font-medium border-b-2 border-blue-500 text-white"
        >
          Upload
        </button>
        <button 
          className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white"
        >
          Generate with AI
        </button>
      </div>

      <div 
        {...getRootProps()}
        className={`flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer ${
          isDragActive ? 'border-blue-500 bg-[#2a2b42]' : 'border-[#3A3B5A] bg-[#1e1f32] hover:border-blue-400'
        }`}
      >
        <input {...getInputProps()} />
        
        {isUploading ? (
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500 mb-2"></div>
            <p className="text-sm text-gray-500">Uploading...</p>
          </div>
        ) : previewUrl ? (
          <div className="relative w-full h-full">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-contain p-2"
            />
            <button
              onClick={(e) => handleClearImage(e)}
              className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-200">
              Drag & drop an image here
            </p>
            <p className="text-xs text-gray-400 mt-2">
              or click to browse files
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Supports: JPG, PNG, WEBP (max 5MB)
            </p>
          </div>
        )}
      </div>
      
      <button
        onClick={handleClearImage}
        className="w-full py-2 text-sm text-gray-400 hover:text-white text-center mt-2"
      >
        No product photo needed
      </button>
    </div>
  );
}