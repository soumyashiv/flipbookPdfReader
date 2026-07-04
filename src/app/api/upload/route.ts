import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const MAX_SIZE = Number(process.env.MAX_UPLOAD_SIZE ?? 52_428_800); // 50 MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, error: 'Only PDF files are supported' },
        { status: 400 }
      );
    }

    // Validate size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `File too large. Maximum size is ${Math.round(MAX_SIZE / 1_048_576)} MB`,
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const title = file.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');

    const book = await db.book.create({
      data: {
        title,
        fileName: file.name,
        fileSize: file.size,
        totalPages: 0, // Will be updated by client after PDF.js loads
        fileData: buffer,
      },
      omit: { fileData: true },
    });

    return NextResponse.json({ success: true, data: book });
  } catch (err) {
    console.error('[POST /api/upload]', err);
    return NextResponse.json(
      { success: false, error: 'Upload failed. Please try again.' },
      { status: 500 }
    );
  }
}

