'use client';

import { useEffect, useCallback } from 'react';
import { useReaderStore } from '@/store/useReaderStore';
import { usePDFDocument } from '@/features/reader/hooks/usePDFDocument';
import { FlipBookCanvas } from '@/features/reader/engine/FlipBookCanvas';
import { PDFPage } from '@/features/reader/pdf/PDFPage';
import { Loader2 } from 'lucide-react';
import type { Book } from '@/types';
import { ReaderToolbar } from './ReaderToolbar';
import { useRef } from 'react';
import { useZoom } from '@/features/reader/hooks/useZoom';
import { useFullscreen } from '@/features/reader/hooks/useFullscreen';
import { useReadingTimer } from '@/features/reader/hooks/useReadingTimer';
import { ReadingProgressBar } from './ReadingProgressBar';
import { ZoomControls } from './ZoomControls';
import { BookmarksPanel } from './BookmarksPanel';
import { ThumbnailsPanel } from './ThumbnailsPanel';
import { CommandPalette } from './CommandPalette';
import { ShortcutsHelp } from './ShortcutsHelp';
import { useKeyboardShortcuts } from '@/features/reader/hooks/useKeyboardShortcuts';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import { useState } from 'react';

interface ReaderLayoutProps {
  book: Book;
}

export function ReaderLayout({ book }: ReaderLayoutProps) {
  const { currentPage, setBookId, setTotalPages, setCurrentPage, triggerFlip } = useReaderStore();
  const { autoHideToolbar, readerTheme, pageBackground } = usePreferencesStore();
  const { pdf, isLoading, error } = usePDFDocument(`/api/books/${book.id}`);

  // Ref for fullscreen & zoom bounding
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Phase 3 hooks
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen(containerRef);
  const zoom = useZoom(containerRef);
  const timer = useReadingTimer();

  // Phase 6 UI state
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShortcutsHelpOpen, setIsShortcutsHelpOpen] = useState(false);

  // Keyboard Shortcuts Hook
  useKeyboardShortcuts(
    toggleFullscreen,
    zoom.zoomIn,
    zoom.zoomOut,
    zoom.resetZoom,
    zoom.fitWidth,
    triggerFlip,
    setIsCommandPaletteOpen,
    setIsShortcutsHelpOpen
  );

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
    <div 
      ref={containerRef}
      className={`relative w-full h-screen overflow-hidden flex flex-col ${readerTheme}`}
    >
      <ReadingProgressBar />
      
      <div className={`toolbar-autohide z-50 ${autoHideToolbar ? 'hover:opacity-100 opacity-0 absolute top-0 inset-x-0 transition-opacity' : 'relative'}`}>
        <ReaderToolbar 
          bookTitle={book.title} 
          timer={timer}
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
        />
      </div>
      
      <main 
        className="flex-1 relative overflow-hidden flex items-center justify-center bg-pf-bg-base"
        onTouchStart={zoom.handleTouchStart}
        onTouchMove={zoom.handleTouchMove}
        onTouchEnd={zoom.handleTouchEnd}
      >
        {isLoading || !pdf ? (
          <div className="flex flex-col items-center justify-center gap-4 text-pf-text-secondary">
            <Loader2 size={32} className="animate-spin text-pf-accent" />
            <p>Loading flipbook...</p>
          </div>
        ) : (
          <div 
            className="zoom-container w-full h-full flex items-center justify-center"
            style={{ transform: `scale(${zoom.zoomLevel})` }}
          >
            <FlipBookCanvas 
              totalPages={pdf.numPages} 
              renderPage={renderPage} 
            />
          </div>
        )}

        <div className="absolute bottom-6 inset-x-0 flex justify-center pointer-events-none">
          <div className="pointer-events-auto">
            <ZoomControls {...zoom} />
          </div>
        </div>

        <BookmarksPanel />
        <ThumbnailsPanel />
      </main>

      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
        toggleFullscreen={toggleFullscreen}
      />
      <ShortcutsHelp 
        isOpen={isShortcutsHelpOpen} 
        onClose={() => setIsShortcutsHelpOpen(false)} 
      />
    </div>
  );
}
