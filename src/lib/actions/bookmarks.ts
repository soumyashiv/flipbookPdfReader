'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import type { ApiResponse, Bookmark } from '@/types';

// ─── Toggle Bookmark ────────────────────────────────────────────────────────

export async function toggleBookmark(
  bookId: string,
  pageNumber: number,
  label?: string
): Promise<ApiResponse<{ added: boolean; bookmark: Bookmark | null }>> {
  try {
    const existing = await db.bookmark.findUnique({
      where: { bookId_pageNumber: { bookId, pageNumber } },
    });

    if (existing) {
      await db.bookmark.delete({ where: { id: existing.id } });
      revalidatePath(`/reader/${bookId}`);
      return {
        data: { added: false, bookmark: null },
        error: null,
        success: true,
      };
    }

    const bookmark = await db.bookmark.create({
      data: { bookId, pageNumber, label: label ?? null },
    });
    revalidatePath(`/reader/${bookId}`);
    return {
      data: {
        added: true,
        bookmark: {
          ...bookmark,
          createdAt: bookmark.createdAt,
        },
      },
      error: null,
      success: true,
    };
  } catch (err) {
    console.error('[toggleBookmark]', err);
    return { data: null, error: 'Failed to toggle bookmark', success: false };
  }
}

// ─── Delete Bookmark ────────────────────────────────────────────────────────

export async function deleteBookmark(
  id: string,
  bookId: string
): Promise<ApiResponse<null>> {
  try {
    await db.bookmark.delete({ where: { id } });
    revalidatePath(`/reader/${bookId}`);
    return { data: null, error: null, success: true };
  } catch (err) {
    console.error('[deleteBookmark]', err);
    return { data: null, error: 'Failed to delete bookmark', success: false };
  }
}

// ─── Get Bookmarks for Book ─────────────────────────────────────────────────

export async function getBookmarks(
  bookId: string
): Promise<ApiResponse<Bookmark[]>> {
  try {
    const bookmarks = await db.bookmark.findMany({
      where: { bookId },
      orderBy: { pageNumber: 'asc' },
    });
    return { data: bookmarks as Bookmark[], error: null, success: true };
  } catch (err) {
    console.error('[getBookmarks]', err);
    return { data: null, error: 'Failed to load bookmarks', success: false };
  }
}
