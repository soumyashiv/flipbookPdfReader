'use client';

import Link from 'next/link';
import { ArrowLeft, Monitor, BookOpen, Settings2 } from 'lucide-react';
import { useReaderStore } from '@/store/useReaderStore';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AnimationStyle } from '@/types';

interface ReaderToolbarProps {
  bookTitle: string;
}

export function ReaderToolbar({ bookTitle }: ReaderToolbarProps) {
  const { currentPage, totalPages, viewMode, setViewMode, setCurrentPage } = useReaderStore();
  const { animationStyle, setAnimationStyle } = usePreferencesStore();

  const handlePageChange = (value: number | readonly number[]) => {
    const page = Array.isArray(value) ? (value as number[])[0] : (value as number);
    setCurrentPage(page);
  };


  const animationStyles: { value: AnimationStyle; label: string }[] = [
    { value: 'book', label: 'Classic Book' },
    { value: 'magazine', label: 'Magazine (Soft)' },
    { value: 'hardcover', label: 'Hardcover (Stiff)' },
    { value: 'notebook', label: 'Notebook (Bouncy)' },
    { value: 'minimal', label: 'Minimal (Flat)' },
  ];

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-pf-bg-card border-b border-pf-border z-50">
      <div className="flex items-center gap-4">
        <Link 
          href="/library"
          className="p-2 -ml-2 rounded-full hover:bg-pf-bg-subtle text-pf-text-secondary transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-semibold text-pf-text-primary line-clamp-1 max-w-[200px] sm:max-w-xs">
          {bookTitle}
        </h1>
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

        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 w-9 bg-transparent border border-pf-border hover:bg-pf-bg-subtle text-pf-text-secondary">
            <Settings2 size={18} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-pf-bg-elevated border-pf-border">
            <DropdownMenuLabel>Animation Style</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-pf-border" />
            {animationStyles.map((style) => (
              <DropdownMenuItem
                key={style.value}
                onClick={() => setAnimationStyle(style.value)}
                className={`cursor-pointer ${animationStyle === style.value ? 'text-pf-accent bg-pf-accent/10' : ''}`}
              >
                {style.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
