'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { MoreVertical, Star, Trash, BookOpen } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import type { Book } from '@/types';
import { formatFileSize, formatRelativeTime } from '@/utils/format';
import { updateBook, deleteBook } from '@/lib/actions/books';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';
import { BookDetailsSheet } from './BookDetailsSheet';
import dynamic from 'next/dynamic';

const Document = dynamic(() => import('react-pdf').then(mod => {
  mod.pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${mod.pdfjs.version}/build/pdf.worker.min.mjs`;
  return mod.Document;
}), { ssr: false, loading: () => <div className="w-full h-full skeleton" /> });
const Page = dynamic(() => import('react-pdf').then(mod => mod.Page), { ssr: false });

interface BookCardProps {
  book: Book;
  view: 'grid' | 'list';
}

export function BookCard({ book, view }: BookCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    const res = await updateBook(book.id, { isFavorite: !book.isFavorite });
    if (!res.success) toast.error('Failed to update favorite status');
    setIsUpdating(false);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this book?')) {
      const res = await deleteBook(book.id);
      if (res.success) toast.success('Book deleted');
      else toast.error('Failed to delete book');
    }
  };

  const progressPercent = book.progress
    ? Math.round((book.progress.currentPage / Math.max(book.totalPages, 1)) * 100)
    : 0;

  if (view === 'list') {
    return (
      <>
        <div onClick={() => setIsSheetOpen(true)} className="block cursor-pointer">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-4 bg-pf-bg-card rounded-xl border border-pf-border hover:border-pf-accent transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-16 bg-pf-bg-subtle rounded-md overflow-hidden relative shadow-sm">
                <Document file={`/api/books/${book.id}`} loading={<div className="w-full h-full skeleton" />}>
                  <Page
                    pageNumber={book.coverPage}
                    width={48}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </Document>
              </div>
              <div>
                <h3 className="font-semibold text-pf-text-primary line-clamp-1">{book.title}</h3>
                <p className="text-xs text-pf-text-secondary mt-1">
                  {book.totalPages} pages • {formatFileSize(book.fileSize)} • Added {formatRelativeTime(book.createdAt)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
              {progressPercent > 0 && progressPercent < 100 && (
                <Badge variant="secondary" className="bg-pf-bg-subtle font-medium text-pf-accent">
                  {progressPercent}% read
                </Badge>
              )}
              <button
                onClick={toggleFavorite}
                disabled={isUpdating}
                className="p-2 hover:bg-pf-bg-subtle rounded-full transition-colors"
              >
                <Star
                  size={18}
                  className={book.isFavorite ? 'fill-pf-warning text-pf-warning' : 'text-pf-text-tertiary'}
                />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger className="p-2 hover:bg-pf-bg-subtle rounded-full transition-colors text-pf-text-tertiary">
                  <MoreVertical size={18} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-pf-bg-elevated border-pf-border">
                  <DropdownMenuItem>
                    <Link href={`/reader/${book.id}`} className="flex items-center w-full cursor-pointer">
                      <BookOpen size={14} className="mr-2" /> Open Reader
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-pf-error focus:text-pf-error focus:bg-pf-error/10" onClick={handleDelete}>
                    <Trash size={14} className="mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </motion.div>
        </div>
        <BookDetailsSheet book={book} isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} />
      </>
    );
  }

  // Grid View
  return (
    <>
      <div onClick={() => setIsSheetOpen(true)} className="block group cursor-pointer">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="book-card relative flex flex-col gap-3"
        >
          <div className="relative aspect-[1/1.4] w-full rounded-r-lg rounded-l-[3px] shadow-md transition-all duration-300 group-hover:shadow-xl overflow-hidden bg-pf-bg-subtle">
            {/* Spine effect */}
            <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/40 via-white/10 to-transparent z-10 pointer-events-none" />
            
            <Document
              file={`/api/books/${book.id}`}
              loading={<div className="w-full h-full skeleton" />}
              onLoadSuccess={() => setCoverLoaded(true)}
              className={cn("w-full h-full object-cover transition-opacity duration-300", coverLoaded ? "opacity-100" : "opacity-0")}
            >
              <Page
                pageNumber={book.coverPage}
                renderMode="canvas"
                width={250}
                className="w-full h-full"
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>

            {/* Overlays */}
            <div className={cn(
              "absolute inset-0 bg-black/40 transition-opacity duration-300 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100"
            )}>
              <div className="bg-pf-accent/90 text-white px-4 py-2 rounded-full font-medium shadow-accent flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all">
                <BookOpen size={16} /> Details
              </div>
            </div>

            {book.isFavorite && (
              <div className="absolute top-2 right-2 z-20 drop-shadow-md">
                <Star size={20} className="fill-pf-warning text-pf-warning" />
              </div>
            )}

            {progressPercent > 0 && progressPercent < 100 && (
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-pf-bg-subtle z-20">
                <div 
                  className="h-full bg-pf-accent transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            )}
            
            {book.progress?.lastOpenedAt && (
              <div className="absolute top-2 left-2 z-20">
                <Badge variant="secondary" className="bg-black/60 text-white/90 border-none backdrop-blur-sm shadow-sm font-medium text-[10px]">
                  Read {formatRelativeTime(book.progress.lastOpenedAt).replace(' ago', '')}
                </Badge>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-medium text-pf-text-primary line-clamp-2 leading-tight group-hover:text-pf-accent transition-colors">
              {book.title}
            </h3>
            <p className="text-xs text-pf-text-tertiary mt-1">
              {formatRelativeTime(book.createdAt)}
            </p>
          </div>
        </motion.div>
      </div>
      <BookDetailsSheet book={book} isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} />
    </>
  );
}
