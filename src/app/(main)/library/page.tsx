import { getBooks } from '@/lib/actions/books';
import { EmptyLibrary } from '@/features/library/components/EmptyLibrary';
import { ReadingStats } from '@/features/library/components/ReadingStats';
import { BookGrid } from '@/features/library/components/BookGrid';
import { ContinueReading } from '@/features/library/components/ContinueReading';

export default async function LibraryPage() {
  const res = await getBooks();
  const allBooks = res.data || [];

  if (allBooks.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <EmptyLibrary />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-pf-text-primary">Library</h1>
          <p className="text-pf-text-secondary mt-1">Manage and organize your digital collection.</p>
        </div>
      </div>
      
      <ReadingStats books={allBooks} />
      <ContinueReading books={allBooks} />
      <BookGrid books={allBooks} />
    </div>
  );
}
