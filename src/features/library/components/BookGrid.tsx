'use client';

import { useLibraryStore } from '@/store/useLibraryStore';
import { BookCard } from './BookCard';
import type { Book } from '@/types';
import { motion } from 'motion/react';

interface BookGridProps {
  books: Book[];
}

export function BookGrid({ books }: BookGridProps) {
  const { view, sortBy, searchQuery, showFavoritesOnly } = useLibraryStore();

  // Filter & Sort
  const filteredBooks = books
    .filter((b) => (showFavoritesOnly ? b.isFavorite : true))
    .filter((b) =>
      searchQuery ? b.title.toLowerCase().includes(searchQuery.toLowerCase()) : true
    )
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'name') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'favorites') {
        return (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0);
      }
      return 0;
    });

  if (filteredBooks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-pf-text-tertiary">
        <p>No books found matching your criteria.</p>
      </div>
    );
  }

  return (
    <motion.div
      layout
      className={
        view === 'grid'
          ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6'
          : 'flex flex-col gap-3'
      }
    >
      {filteredBooks.map((book) => (
        <BookCard key={book.id} book={book} view={view} />
      ))}
    </motion.div>
  );
}
