import { getBooks } from '@/lib/actions/books';
import { EmptyLibrary } from '@/features/library/components/EmptyLibrary';
import { BookGrid } from '@/features/library/components/BookGrid';
import { LibraryHeader } from '@/features/library/components/LibraryHeader';

export default async function LibraryPage() {
  const response = await getBooks();
  const books = response.data || [];

  return (
    <div className="min-h-screen bg-pf-bg-base text-pf-text-primary pb-24">
      <div className="max-w-7xl mx-auto px-6 pt-12">
        <LibraryHeader />
        
        {books.length === 0 ? (
          <EmptyLibrary />
        ) : (
          <BookGrid books={books} />
        )}
      </div>
    </div>
  );
}
