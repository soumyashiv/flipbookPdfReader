'use client';

import Link from 'next/link';
import { ArrowLeft, Monitor, BookOpen, Settings2, Maximize, Minimize, Clock, Bookmark, LayoutGrid } from 'lucide-react';
import { useReaderStore } from '@/store/useReaderStore';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import { Slider } from '@/components/ui/slider';
import { SettingsPanel } from './SettingsPanel';


interface ReaderToolbarProps {
  bookTitle: string;
  timer?: { elapsedTimeFormatted: string; estimatedRemainingFormatted: string };
  isFullscreen?: boolean;
  toggleFullscreen?: () => void;
}

export function ReaderToolbar({ bookTitle, timer, isFullscreen, toggleFullscreen }: ReaderToolbarProps) {
  const { 
    currentPage, totalPages, viewMode, setViewMode, setCurrentPage,
    isBookmarksOpen, setIsBookmarksOpen,
    isThumbnailsOpen, setIsThumbnailsOpen
  } = useReaderStore();
  
  const handlePageChange = (value: number | readonly number[]) => {
    const page = Array.isArray(value) ? (value as number[])[0] : (value as number);
    setCurrentPage(page);
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-pf-bg-card border-b border-pf-border z-50">
      <div className="flex items-center gap-4">
        <Link 
          href="/library"
          className="p-2 -ml-2 rounded-full hover:bg-pf-bg-subtle text-pf-text-secondary transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-semibold text-pf-text-primary line-clamp-1 max-w-[200px] sm:max-w-xs">
            {bookTitle}
          </h1>
          {timer && (
            <div className="flex items-center gap-2 text-[10px] font-medium text-pf-text-tertiary mt-0.5">
              <span className="flex items-center gap-1"><Clock size={10} /> {timer.elapsedTimeFormatted}</span>
              <span>•</span>
              <span>{timer.estimatedRemainingFormatted} left</span>
            </div>
          )}
        </div>
      </div>

      <div className="hidden sm:flex flex-1 max-w-md mx-8 items-center gap-4">
        <span className="text-xs font-medium text-pf-text-tertiary tabular-nums w-8 text-right">
          {currentPage}
        </span>
        <Slider
          value={[currentPage]}
          min={1}
          max={totalPages || 1}
          step={1}
          onValueChange={handlePageChange}
          className="flex-1 cursor-pointer"
        />
        <span className="text-xs font-medium text-pf-text-tertiary tabular-nums w-8">
          {totalPages}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center bg-pf-bg-subtle p-1 rounded-lg mr-2">
          <button
            onClick={() => setIsThumbnailsOpen(!isThumbnailsOpen)}
            className={`p-1.5 rounded-md transition-colors ${isThumbnailsOpen ? 'bg-pf-bg-elevated shadow-sm text-pf-accent' : 'text-pf-text-tertiary hover:text-pf-text-secondary'}`}
            title="Pages"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setIsBookmarksOpen(!isBookmarksOpen)}
            className={`p-1.5 rounded-md transition-colors ${isBookmarksOpen ? 'bg-pf-bg-elevated shadow-sm text-pf-accent' : 'text-pf-text-tertiary hover:text-pf-text-secondary'}`}
            title="Bookmarks"
          >
            <Bookmark size={16} />
          </button>
        </div>

        <div className="hidden md:flex w-px h-6 bg-pf-border mx-1" />

        <div className="hidden sm:flex items-center bg-pf-bg-subtle p-1 rounded-lg mr-2">
          <button
            onClick={() => setViewMode('single')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'single' ? 'bg-pf-bg-elevated shadow-sm text-pf-text-primary' : 'text-pf-text-tertiary hover:text-pf-text-secondary'}`}
            title="Single Page View"
          >
            <Monitor size={16} />
          </button>
          <button
            onClick={() => setViewMode('double')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'double' ? 'bg-pf-bg-elevated shadow-sm text-pf-text-primary' : 'text-pf-text-tertiary hover:text-pf-text-secondary'}`}
            title="Two Page View"
          >
            <BookOpen size={16} />
          </button>
        </div>

        <SettingsPanel />

        {toggleFullscreen && (
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-md text-pf-text-tertiary hover:text-pf-text-primary transition-colors bg-pf-bg-subtle hover:bg-pf-bg-elevated border border-transparent hover:border-pf-border"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
        )}
      </div>
    </header>
  );
}
