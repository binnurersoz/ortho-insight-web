import React, { useCallback, useState } from 'react';
import { Upload, Camera, CheckCircle, Sparkles } from 'lucide-react';

interface PhotoUploadProps {
  onPhotoSelect: (file: File) => void;
  selectedPhoto: File | null;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onPhotoSelect, selectedPhoto }) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      onPhotoSelect(files[0]);
    }
  }, [onPhotoSelect]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onPhotoSelect(files[0]);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Camera className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
          Upload Your Profile Photo
        </h2>
        <p className="text-gray-600">
          Follow our photo guidelines for best results
        </p>
      </div>
      
      <div
        className={`relative border-3 border-dashed rounded-3xl p-12 text-center transition-all duration-300 transform ${
          dragOver
            ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-cyan-50 scale-105 shadow-2xl'
            : selectedPhoto
            ? 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl'
            : 'border-gray-300 bg-gradient-to-br from-gray-50 to-slate-50 hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 hover:shadow-lg hover:scale-102'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="flex flex-col items-center space-y-6">
          {selectedPhoto ? (
            <>
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xl font-semibold text-green-700">
                  Photo Selected!
                </p>
                <p className="text-green-600 font-medium">
                  {selectedPhoto.name}
                </p>
                <p className="text-sm text-gray-500">
                  Click to change or drag a new photo
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center">
                <Upload className="w-10 h-10 text-gray-500" />
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-2xl font-semibold text-gray-800 mb-2">
                    Drop your photo here
                  </p>
                  <p className="text-lg text-blue-600 font-medium mb-2">
                    or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    JPG, PNG files supported (max 10MB)
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-8 bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-6 flex items-center text-lg">
          <Camera className="w-6 h-6 mr-3 text-blue-500" />
          Photo Guidelines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-gray-800">Profile position</p>
                <p className="text-sm text-gray-600">Side profile facing right</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-gray-800">Background</p>
                <p className="text-sm text-gray-600">Plain, dark or pattern-free</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-gray-800">Lighting</p>
                <p className="text-sm text-gray-600">Good lighting on your face</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-gray-800">Expression</p>
                <p className="text-sm text-gray-600">Relaxed, lips closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoUpload;
