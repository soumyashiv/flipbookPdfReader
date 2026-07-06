'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { BookOpen, Star, Trash, Calendar, FileText, HardDrive, Clock } from 'lucide-react';
import type { Book } from '@/types';
import { formatFileSize, formatRelativeTime } from '@/utils/format';
import { updateBook, deleteBook } from '@/lib/actions/books';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

const Document = dynamic(() => import('react-pdf').then(mod => {
  mod.pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${mod.pdfjs.version}/build/pdf.worker.min.mjs`;
  return mod.Document;
}), { ssr: false, loading: () => <div className="w-full h-full skeleton" /> });
const Page = dynamic(() => import('react-pdf').then(mod => mod.Page), { ssr: false });

interface BookDetailsSheetProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookDetailsSheet({ book, isOpen, onClose }: BookDetailsSheetProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  if (!book) return null;

  const toggleFavorite = async () => {
    setIsUpdating(true);
    const res = await updateBook(book.id, { isFavorite: !book.isFavorite });
    if (!res.success) toast.error('Failed to update favorite status');
    setIsUpdating(false);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this book?')) {
      const res = await deleteBook(book.id);
      if (res.success) {
        toast.success('Book deleted');
        onClose();
      } else {
        toast.error('Failed to delete book');
      }
    }
  };

  const progressPercent = book.progress
    ? Math.round((book.progress.currentPage / Math.max(book.totalPages, 1)) * 100)
    : 0;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="h-[85vh] sm:h-auto sm:max-h-[85vh] rounded-t-3xl bg-pf-bg-elevated border-pf-border px-0 pb-0 overflow-hidden flex flex-col">
        <SheetHeader className="px-6 py-4 border-b border-pf-border bg-pf-bg-subtle/50 text-left shrink-0">
          <SheetTitle className="text-xl font-bold text-pf-text-primary">Book Details</SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-6 flex flex-col sm:flex-row gap-8 scrollbar-thin">
          {/* Cover */}
          <div className="shrink-0 mx-auto sm:mx-0 w-48 sm:w-64 aspect-[1/1.4] bg-pf-bg-subtle rounded-r-xl rounded-l-[4px] shadow-2xl overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/40 via-white/10 to-transparent z-10 pointer-events-none" />
            <Document file={`/api/books/${book.id}`} loading={<div className="w-full h-full skeleton" />}>
              <Page
                pageNumber={book.coverPage}
                width={256}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="w-full h-full object-cover"
              />
            </Document>
            {progressPercent > 0 && progressPercent < 100 && (
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-pf-bg-subtle z-20">
                <div 
                  className="h-full bg-pf-accent" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col">
            <h2 className="text-2xl font-bold text-pf-text-primary leading-tight mb-2">
              {book.title}
            </h2>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {book.isFavorite && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pf-warning/10 text-pf-warning text-xs font-semibold">
                  <Star size={12} className="fill-current" /> Favorite
                </span>
              )}
              {progressPercent > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pf-accent/10 text-pf-accent text-xs font-semibold">
                  {progressPercent === 100 ? 'Completed' : `${progressPercent}% Read`}
                </span>
              )}
              {progressPercent > 0 && book.progress?.timeSpentSeconds && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pf-bg-subtle text-pf-text-secondary text-xs font-medium">
                  <Clock size={12} /> {Math.round(book.progress.timeSpentSeconds / 60)} min read
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm text-pf-text-secondary mb-8 bg-pf-bg-card p-4 rounded-xl border border-pf-border">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-pf-text-tertiary" />
                <span><strong className="text-pf-text-primary font-medium">{book.totalPages}</strong> pages</span>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive size={16} className="text-pf-text-tertiary" />
                <span><strong className="text-pf-text-primary font-medium">{formatFileSize(book.fileSize)}</strong> size</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-pf-text-tertiary" />
                <span>Added <strong className="text-pf-text-primary font-medium">{formatRelativeTime(book.createdAt)}</strong></span>
              </div>
              {book.progress && book.progress.lastOpenedAt && (
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-pf-text-tertiary" />
                  <span>Read <strong className="text-pf-text-primary font-medium">{formatRelativeTime(book.progress.lastOpenedAt)}</strong></span>
                </div>
              )}
            </div>

            <div className="mt-auto flex items-center gap-3">
              <Button 
                onClick={() => router.push(`/reader/${book.id}`)}
                className="flex-1 h-12 bg-pf-accent hover:bg-pf-accent-hover text-white rounded-xl font-semibold shadow-accent hover:shadow-accent-hover transition-all"
              >
                <BookOpen size={18} className="mr-2" />
                {progressPercent > 0 && progressPercent < 100 ? 'Continue Reading' : 'Read Now'}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleFavorite}
                disabled={isUpdating}
                className={`h-12 w-12 rounded-xl border-pf-border ${book.isFavorite ? 'bg-pf-warning/10 border-pf-warning/30 hover:bg-pf-warning/20' : 'bg-pf-bg-card hover:bg-pf-bg-subtle'}`}
              >
                <Star size={20} className={book.isFavorite ? 'fill-pf-warning text-pf-warning' : 'text-pf-text-secondary'} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleDelete}
                className="h-12 w-12 rounded-xl border-pf-border bg-pf-bg-card hover:bg-pf-error/10 hover:border-pf-error/30 hover:text-pf-error text-pf-text-secondary transition-colors"
              >
                <Trash size={20} />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
