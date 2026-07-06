'use client';

import { BookOpen, Clock, Star, TrendingUp } from 'lucide-react';
import type { Book } from '@/types';

interface ReadingStatsProps {
  books: Book[];
}

export function ReadingStats({ books }: ReadingStatsProps) {
  const totalBooks = books.length;
  const favoriteBooks = books.filter((b) => b.isFavorite).length;
  
  const inProgress = books.filter(
    (b) => b.progress && b.progress.currentPage > 1 && b.progress.currentPage < b.totalPages
  ).length;

  const completed = books.filter(
    (b) => b.progress && b.progress.currentPage >= b.totalPages
  ).length;

  const totalTimeSpentSeconds = books.reduce((acc, b) => acc + (b.progress?.timeSpentSeconds || 0), 0);
  const totalHours = Math.floor(totalTimeSpentSeconds / 3600);
  const totalMinutes = Math.floor((totalTimeSpentSeconds % 3600) / 60);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-pf-bg-card border border-pf-border rounded-2xl p-4 flex flex-col gap-2 relative overflow-hidden group">
        <div className="absolute -right-4 -top-4 w-16 h-16 bg-pf-accent/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
        <div className="text-pf-text-secondary flex items-center gap-2 text-sm font-medium">
          <BookOpen size={16} className="text-pf-accent" /> Total Books
        </div>
        <div className="text-2xl font-bold text-pf-text-primary">{totalBooks}</div>
      </div>

      <div className="bg-pf-bg-card border border-pf-border rounded-2xl p-4 flex flex-col gap-2 relative overflow-hidden group">
        <div className="absolute -right-4 -top-4 w-16 h-16 bg-pf-warning/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
        <div className="text-pf-text-secondary flex items-center gap-2 text-sm font-medium">
          <TrendingUp size={16} className="text-pf-warning" /> In Progress
        </div>
        <div className="text-2xl font-bold text-pf-text-primary">{inProgress}</div>
      </div>

      <div className="bg-pf-bg-card border border-pf-border rounded-2xl p-4 flex flex-col gap-2 relative overflow-hidden group">
        <div className="absolute -right-4 -top-4 w-16 h-16 bg-pf-success/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
        <div className="text-pf-text-secondary flex items-center gap-2 text-sm font-medium">
          <Star size={16} className="text-pf-success" /> Completed
        </div>
        <div className="text-2xl font-bold text-pf-text-primary">{completed}</div>
      </div>

      <div className="bg-pf-bg-card border border-pf-border rounded-2xl p-4 flex flex-col gap-2 relative overflow-hidden group">
        <div className="absolute -right-4 -top-4 w-16 h-16 bg-purple-500/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
        <div className="text-pf-text-secondary flex items-center gap-2 text-sm font-medium">
          <Clock size={16} className="text-purple-500" /> Time Read
        </div>
        <div className="text-2xl font-bold text-pf-text-primary">
          {totalHours > 0 ? `${totalHours}h ${totalMinutes}m` : `${totalMinutes}m`}
        </div>
      </div>
    </div>
  );
}
