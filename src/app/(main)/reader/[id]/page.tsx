import { getBook } from '@/lib/actions/books';
import { ReaderLayout } from '@/features/reader/components/ReaderLayout';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface ReaderPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ReaderPageProps): Promise<Metadata> {
  const { id } = await params;
  const res = await getBook(id);
  const book = res.data;

  if (!book) {
    return { title: 'Book Not Found' };
  }

  return {
    title: book.title,
  };
}

export default async function ReaderPage({ params }: ReaderPageProps) {
  const { id } = await params;
  const res = await getBook(id);
  const book = res.data;

  if (!book) {
    notFound();
  }

  return <ReaderLayout book={book} />;
}
