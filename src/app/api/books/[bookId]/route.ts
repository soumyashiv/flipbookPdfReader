import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { updateBook, deleteBook } from '@/lib/actions/books';

// GET /api/books/[bookId] — Serve the PDF binary
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await params;
    const book = await db.book.findUnique({
      where: { id: bookId },
      select: { fileData: true, fileName: true },
    });

    if (!book?.fileData) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    return new NextResponse(book.fileData, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${book.fileName}"`,
        'Cache-Control': 'private, max-age=3600',
        'Content-Length': String(book.fileData.length),
      },
    });
  } catch (err) {
    console.error('[GET /api/books/:id]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PATCH /api/books/[bookId] — Update title / favorite / reading progress
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  const { bookId } = await params;
  const body = await req.json();

  // Route to reading-progress update if currentPage is provided
  if (typeof body.currentPage === 'number') {
    const { updateReadingProgress } = await import('@/lib/actions/books');
    const result = await updateReadingProgress(bookId, body.currentPage);
    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  }

  // Otherwise update book metadata (title, isFavorite, etc.)
  const result = await updateBook(bookId, body);
  return NextResponse.json(result, { status: result.success ? 200 : 500 });
}


// DELETE /api/books/[bookId] — Delete book
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  const { bookId } = await params;
  const result = await deleteBook(bookId);
  return NextResponse.json(result, { status: result.success ? 200 : 500 });
}

// PATCH /api/books/[bookId]/pages — Update page count after PDF.js load
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  const { bookId } = await params;
  const { totalPages } = await req.json();
  try {
    await db.book.update({
      where: { id: bookId },
      data: { totalPages },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[PUT /api/books/:id]', err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
