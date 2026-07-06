'use client';

import { useReaderStore } from '@/store/useReaderStore';

export function ReadingProgressBar() {
  const { currentPage, totalPages } = useReaderStore();

  if (totalPages <= 0) return null;

  const progress = (currentPage / totalPages) * 100;

  return (
    <div className="absolute top-0 inset-x-0 h-1 bg-pf-bg-overlay z-50">
      <div 
        className="h-full bg-pf-accent transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
