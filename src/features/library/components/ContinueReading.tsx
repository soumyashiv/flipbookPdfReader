'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { BookOpen, ArrowRight, Clock } from 'lucide-react';
import type { Book } from '@/types';
import { formatRelativeTime } from '@/utils/format';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const Document = dynamic(() => import('react-pdf').then(mod => {
  mod.pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${mod.pdfjs.version}/build/pdf.worker.min.mjs`;
  return mod.Document;
}), { ssr: false, loading: () => <div className="w-full h-full skeleton" /> });
const Page = dynamic(() => import('react-pdf').then(mod => mod.Page), { ssr: false });

interface ContinueReadingProps {
  books: Book[];
}

export function ContinueReading({ books }: ContinueReadingProps) {
  const inProgress = books.filter(
    (b) => b.progress && b.progress.currentPage > 1 && b.totalPages > 0
      && b.progress.currentPage < b.totalPages
  );

  if (inProgress.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-pf-accent" />
          <h2 className="font-semibold text-pf-text-primary">Continue Reading</h2>
        </div>
        <span className="text-xs text-pf-text-tertiary">{inProgress.length} in progress</span>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
        {inProgress.map((book, i) => (
          <ContinueCard key={book.id} book={book} index={i} />
        ))}
      </div>
    </section>
  );
}

function ContinueCard({ book, index }: { book: Book; index: number }) {
  const [coverLoaded, setCoverLoaded] = useState(false);
  const progress = book.progress!;
  const pct = Math.round((progress.currentPage / Math.max(book.totalPages, 1)) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex-shrink-0 w-40"
    >
      <Link href={`/reader/${book.id}`} className="group block">
        <div className="relative aspect-[1/1.4] w-full rounded-xl overflow-hidden bg-pf-bg-subtle shadow-md mb-2 border border-pf-border group-hover:border-pf-accent/50 transition-colors">
          {/* Spine effect */}
          <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-r from-black/30 via-white/8 to-transparent z-10 pointer-events-none" />
          <Document
            file={`/api/books/${book.id}`}
            loading={<div className="w-full h-full skeleton" />}
            onLoadSuccess={() => setCoverLoaded(true)}
          >
            <Page
              pageNumber={book.coverPage}
              width={160}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className={coverLoaded ? 'opacity-100' : 'opacity-0'}
            />
          </Document>
          {/* Progress overlay */}
          <div className="absolute bottom-0 inset-x-0 h-1 bg-pf-bg-subtle z-20">
            <div className="h-full bg-pf-accent transition-all" style={{ width: `${pct}%` }} />
          </div>
          {/* Open icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 z-20">
            <div className="flex items-center gap-1 bg-pf-accent/90 text-white text-xs font-medium px-3 py-1.5 rounded-full">
              <BookOpen size={12} />
              Resume
            </div>
          </div>
        </div>
        <p className="text-xs font-medium text-pf-text-primary line-clamp-1 group-hover:text-pf-accent transition-colors">{book.title}</p>
        <p className="text-[10px] text-pf-text-tertiary mt-0.5">p.{progress.currentPage} · {pct}% done</p>
        <p className="text-[10px] text-pf-text-tertiary">{formatRelativeTime(book.updatedAt)}</p>
      </Link>
    </motion.div>
  );
}
