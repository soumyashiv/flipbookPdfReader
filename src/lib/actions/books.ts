'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import type { ApiResponse, Book } from '@/types';

// ─── Get All Books ──────────────────────────────────────────────────────────

export async function getBooks(): Promise<ApiResponse<Book[]>> {
  try {
    const books = await db.book.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        progress: true,
        bookmarks: { orderBy: { pageNumber: 'asc' } },
      },
      // Exclude raw fileData from list queries for performance
      omit: { fileData: true },
    });
    return { data: books as unknown as Book[], error: null, success: true };
  } catch (err) {
    console.error('[getBooks]', err);
    return { data: null, error: 'Failed to load library', success: false };
  }
}

// ─── Get Single Book ────────────────────────────────────────────────────────

export async function getBook(
  id: string
): Promise<ApiResponse<Book>> {
  try {
    const book = await db.book.findUnique({
      where: { id },
      include: {
        progress: true,
        bookmarks: { orderBy: { pageNumber: 'asc' } },
      },
      omit: { fileData: true },
    });
    if (!book) return { data: null, error: 'Book not found', success: false };
    return { data: book as unknown as Book, error: null, success: true };
  } catch (err) {
    console.error('[getBook]', err);
    return { data: null, error: 'Failed to load book', success: false };
  }
}

// ─── Create Book ────────────────────────────────────────────────────────────

export async function createBook(formData: {
  title: string;
  fileName: string;
  fileSize: number;
  totalPages: number;
  fileData: Buffer;
}): Promise<ApiResponse<Book>> {
  try {
    const book = await db.book.create({
      data: {
        title: formData.title,
        fileName: formData.fileName,
        fileSize: formData.fileSize,
        totalPages: formData.totalPages,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fileData: formData.fileData as any,
      },
      omit: { fileData: true },
    });
    revalidatePath('/library');
    return { data: book as unknown as Book, error: null, success: true };
  } catch (err) {
    console.error('[createBook]', err);
    return { data: null, error: 'Failed to save book', success: false };
  }
}

// ─── Update Book ────────────────────────────────────────────────────────────

export async function updateBook(
  id: string,
  data: { title?: string; isFavorite?: boolean }
): Promise<ApiResponse<Book>> {
  try {
    const book = await db.book.update({
      where: { id },
      data,
      omit: { fileData: true },
    });
    revalidatePath('/library');
    return { data: book as unknown as Book, error: null, success: true };
  } catch (err) {
    console.error('[updateBook]', err);
    return { data: null, error: 'Failed to update book', success: false };
  }
}

// ─── Delete Book ────────────────────────────────────────────────────────────

export async function deleteBook(id: string): Promise<ApiResponse<null>> {
  try {
    await db.book.delete({ where: { id } });
    revalidatePath('/library');
    return { data: null, error: null, success: true };
  } catch (err) {
    console.error('[deleteBook]', err);
    return { data: null, error: 'Failed to delete book', success: false };
  }
}

// ─── Update Reading Progress ────────────────────────────────────────────────

export async function updateReadingProgress(
  bookId: string,
  currentPage: number
): Promise<ApiResponse<null>> {
  try {
    await db.readingProgress.upsert({
      where: { bookId },
      create: { bookId, currentPage },
      update: { currentPage },
    });
    return { data: null, error: null, success: true };
  } catch (err) {
    console.error('[updateReadingProgress]', err);
    return { data: null, error: 'Failed to save progress', success: false };
  }
}
