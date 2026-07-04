'use client';

import { Library, UploadCloud } from 'lucide-react';
import { useLibraryStore } from '@/store/useLibraryStore';

export function EmptyLibrary() {
  const setIsUploadOpen = useLibraryStore((s) => s.setIsUploadOpen);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
      <div className="w-20 h-20 bg-pf-bg-subtle rounded-full flex items-center justify-center mb-6">
        <Library size={32} className="text-pf-text-tertiary" />
      </div>
      <h2 className="text-2xl font-bold text-pf-text-primary mb-2">
        Your Library is Empty
      </h2>
      <p className="text-pf-text-secondary max-w-md mb-8">
        Upload your first PDF book to start building your personal digital library with a beautiful flipbook reading experience.
      </p>
      
      <button
        onClick={() => setIsUploadOpen(true)}
        className="flex items-center gap-2 px-6 py-3 bg-pf-accent hover:bg-pf-accent-from text-white rounded-xl font-medium transition-colors shadow-accent"
      >
        <UploadCloud size={18} />
        Upload PDF
      </button>
    </div>
  );
}
