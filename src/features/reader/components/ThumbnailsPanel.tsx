'use client';

import { useRef, useEffect } from 'react';
import { SidebarPanel } from './SidebarPanel';
import { useReaderStore } from '@/store/useReaderStore';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

const Document = dynamic(() => import('react-pdf').then(mod => {
  mod.pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${mod.pdfjs.version}/build/pdf.worker.min.mjs`;
  return mod.Document;
}), { ssr: false, loading: () => <div className="w-full h-full skeleton" /> });
const Page = dynamic(() => import('react-pdf').then(mod => mod.Page), { ssr: false });

export function ThumbnailsPanel() {
  const { bookId, isThumbnailsOpen, setIsThumbnailsOpen, totalPages, currentPage, setCurrentPage } = useReaderStore();
  const currentRef = useRef<HTMLButtonElement>(null);

  // Scroll to current page thumbnail when opened
  useEffect(() => {
    if (isThumbnailsOpen && currentRef.current) {
      setTimeout(() => {
        currentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [isThumbnailsOpen, currentPage]);

  if (!bookId || totalPages <= 0) return null;

  return (
    <SidebarPanel 
      title="Pages" 
      isOpen={isThumbnailsOpen} 
      onClose={() => setIsThumbnailsOpen(false)}
      width="w-64"
    >
      <div className="flex flex-col gap-4 items-center">
        <Document 
          file={`/api/books/${bookId}`}
          loading={
            <div className="flex flex-col items-center justify-center py-10 text-pf-text-tertiary">
              <Loader2 size={24} className="animate-spin mb-2" />
              <p className="text-xs">Loading thumbnails...</p>
            </div>
          }
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              ref={pageNum === currentPage ? currentRef : null}
              onClick={() => setCurrentPage(pageNum)}
              className={`relative flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
                pageNum === currentPage 
                  ? 'bg-pf-accent/10 outline outline-2 outline-pf-accent outline-offset-[-2px]' 
                  : 'hover:bg-pf-bg-subtle border border-transparent hover:border-pf-border'
              }`}
            >
              <div className="w-32 bg-white shadow-sm overflow-hidden border border-gray-200 aspect-[1/1.4] pointer-events-none">
                <Page 
                  pageNumber={pageNum} 
                  width={128} 
                  renderTextLayer={false} 
                  renderAnnotationLayer={false}
                  loading={<div className="w-full h-full skeleton" />}
                />
              </div>
              <span className={`text-xs font-medium ${pageNum === currentPage ? 'text-pf-accent' : 'text-pf-text-secondary'}`}>
                {pageNum}
              </span>
            </button>
          ))}
        </Document>
      </div>
    </SidebarPanel>
  );
}
