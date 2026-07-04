'use client';

import { useRef } from 'react';
import { UploadCloud, FileType, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUpload } from '../hooks/useUpload';
import { UploadProgress } from './UploadProgress';
import { cn } from '@/utils/cn';

export function UploadDropzone() {
  const {
    isDragging,
    isUploading,
    progress,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
  } = useUpload();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-1">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="application/pdf"
        className="hidden"
        disabled={isUploading}
      />

      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ease-out cursor-pointer',
          'flex flex-col items-center justify-center min-h-[320px] p-8 text-center',
          isDragging
            ? 'border-pf-accent bg-pf-accent/10 scale-[1.02]'
            : 'border-pf-border-strong bg-pf-bg-card hover:bg-pf-bg-subtle hover:border-pf-accent/50'
        )}
      >
        <AnimatePresence mode="wait">
          {!isUploading ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-4"
            >
              <div
                className={cn(
                  'p-4 rounded-full transition-colors duration-300',
                  isDragging ? 'bg-pf-accent/20' : 'bg-pf-bg-subtle'
                )}
              >
                <UploadCloud
                  size={48}
                  className={cn(
                    'transition-colors duration-300',
                    isDragging ? 'text-pf-accent' : 'text-pf-text-secondary'
                  )}
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2 text-pf-text-primary">
                  Upload a PDF Book
                </h3>
                <p className="text-sm text-pf-text-secondary max-w-sm">
                  Drag and drop your PDF file here, or click to browse from your
                  device.
                </p>
              </div>

              <div className="flex items-center gap-2 mt-4 text-xs font-medium text-pf-text-tertiary">
                <FileType size={14} />
                <span>Supports PDF up to 50MB</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full flex flex-col items-center gap-6"
            >
              {progress === 100 ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                >
                  <CheckCircle2 size={56} className="text-pf-success" />
                </motion.div>
              ) : (
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-pf-bg-subtle border-t-pf-accent rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-pf-text-primary">
                    {progress}%
                  </div>
                </div>
              )}

              <div className="w-full max-w-xs space-y-2">
                <h3 className="font-medium text-pf-text-primary text-center">
                  {progress === 100
                    ? 'Upload Complete!'
                    : progress > 80
                    ? 'Processing PDF...'
                    : 'Uploading File...'}
                </h3>
                <UploadProgress value={progress} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
