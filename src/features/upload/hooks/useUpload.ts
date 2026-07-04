import { useState, useCallback } from 'react';
import { useLibraryStore } from '@/store/useLibraryStore';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

// We need to set up the worker for PDF.js to extract page count
if (typeof window !== 'undefined') {
  GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

const MAX_SIZE = 50 * 1024 * 1024; // 50MB

export function useUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const setIsUploadOpen = useLibraryStore((s) => s.setIsUploadOpen);
  const router = useRouter();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are supported.');
      return false;
    }
    if (file.size > MAX_SIZE) {
      toast.error('File size exceeds 50MB limit.');
      return false;
    }
    return true;
  };

  const extractPageCount = async (file: File): Promise<number> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await getDocument(arrayBuffer).promise;
      return pdf.numPages;
    } catch (err) {
      console.error('Error extracting page count:', err);
      return 0; // Fallback
    }
  };

  const uploadFile = useCallback(async (file: File) => {
    if (!validateFile(file)) return;

    setIsUploading(true);
    setProgress(10); // Start progress

    try {
      // 1. Upload the file binary
      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();
      
      const uploadPromise = new Promise<{ success: boolean; error?: string; data?: { id: string } }>((resolve, reject) => {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 60) + 10; // Upload takes up to 70% of progress
            setProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              resolve(JSON.parse(xhr.responseText));
            } catch {
              reject(new Error('Invalid response'));
            }
          } else {
            reject(new Error('Upload failed'));
          }
        };

        xhr.onerror = () => reject(new Error('Network error'));
      });

      xhr.open('POST', '/api/upload');
      xhr.send(formData);

      const res = await uploadPromise;

      if (!res.success) {
        throw new Error(res.error || 'Upload failed');
      }

      setProgress(80);
      const bookId = res.data.id;

      // 2. Extract page count client-side (offloads server)
      const numPages = await extractPageCount(file);
      setProgress(90);

      // 3. Update book with page count
      if (numPages > 0) {
        await fetch(`/api/books/${bookId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ totalPages: numPages }),
        });
      }

      setProgress(100);
      toast.success('Book uploaded successfully!');
      
      // Give UI a moment to show 100% before closing
      setTimeout(() => {
        setIsUploadOpen(false);
        setIsUploading(false);
        setProgress(0);
        router.refresh();
      }, 500);

    } catch (err) {
      console.error('Upload error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during upload.';
      toast.error(errorMessage);
      setIsUploading(false);
      setProgress(0);
    }
  }, [setIsUploadOpen, router]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        uploadFile(e.dataTransfer.files[0]);
      }
    },
    [uploadFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        uploadFile(e.target.files[0]);
      }
    },
    [uploadFile]
  );

  return {
    isDragging,
    isUploading,
    progress,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
  };
}
