'use client';

import { useEffect, useCallback } from 'react';
import { useReaderStore } from '@/store/useReaderStore';
import { usePDFDocument } from '@/features/reader/hooks/usePDFDocument';
import { FlipBookCanvas } from '@/features/reader/engine/FlipBookCanvas';
import { PDFPage } from '@/features/reader/pdf/PDFPage';
import { Loader2 } from 'lucide-react';
import type { Book } from '@/types';
import { ReaderToolbar } from './ReaderToolbar';

interface ReaderLayoutProps {
  book: Book;
}

export function ReaderLayout({ book }: ReaderLayoutProps) {
  const { currentPage, setBookId, setTotalPages, setCurrentPage } = useReaderStore();
  const { pdf, isLoading, error } = usePDFDocument(`/api/books/${book.id}`);

  // Initialize store with book data
  useEffect(() => {
    setBookId(book.id);
    if (book.progress?.currentPage) {
      setCurrentPage(book.progress.currentPage);
    }
  }, [book.id, book.progress, setBookId, setCurrentPage]);

  // Update total pages once PDF loads
  useEffect(() => {
    if (pdf) {
      setTotalPages(pdf.numPages);
    }
  }, [pdf, setTotalPages]);

  // Auto-save progress
  useEffect(() => {
    if (!book.id || !pdf) return;
    
    const timeout = setTimeout(() => {
      // Save reading progress via the PATCH books API
      fetch(`/api/books/${book.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPage }),
      }).catch(console.error);
    }, 1000); // 1s debounce

    return () => clearTimeout(timeout);
  }, [book.id, currentPage, pdf]);

  const renderPage = useCallback((pageIndex: number) => {
    return <PDFPage pdf={pdf} pageNumber={pageIndex} />;
  }, [pdf]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-pf-bg-base">
        <p className="text-pf-error text-lg mb-4">Failed to load PDF</p>
        <p className="text-pf-text-secondary text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-pf-bg-base overflow-hidden flex flex-col">
      <ReaderToolbar bookTitle={book.title} />
      
      <main className="flex-1 relative overflow-hidden flex items-center justify-center">
        {isLoading || !pdf ? (
          <div className="flex flex-col items-center justify-center gap-4 text-pf-text-secondary">
            <Loader2 size={32} className="animate-spin text-pf-accent" />
            <p>Loading flipbook...</p>
          </div>
        ) : (
          <FlipBookCanvas 
            totalPages={pdf.numPages} 
            renderPage={renderPage} 
          />
        )}
      </main>
    </div>
  );
}
