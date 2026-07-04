'use client';

import { useEffect, useRef, useState } from 'react';
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import { cn } from '@/utils/cn';

interface PDFPageProps {
  pdf: PDFDocumentProxy | null;
  pageNumber: number;
  scale?: number;
  className?: string;
  onRenderSuccess?: () => void;
}

export function PDFPage({ pdf, pageNumber, scale = 1.5, className, onRenderSuccess }: PDFPageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [page, setPage] = useState<PDFPageProxy | null>(null);
  const [isRendered, setIsRendered] = useState(false);
  const renderTaskRef = useRef<any>(null);

  // Load the page
  useEffect(() => {
    if (!pdf || pageNumber < 1 || pageNumber > pdf.numPages) return;

    let isMounted = true;

    pdf.getPage(pageNumber).then((p) => {
      if (isMounted) setPage(p);
    });

    return () => {
      isMounted = false;
      // Note: page cleanup is managed by pdf.js when the document is destroyed
    };
  }, [pdf, pageNumber]);

  // Render the page to canvas
  useEffect(() => {
    if (!page || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Use devicePixelRatio for sharp rendering on retina displays
    const pixelRatio = window.devicePixelRatio || 1;
    const viewport = page.getViewport({ scale: scale * pixelRatio });

    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    // Scale down via CSS to fit container
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
      background: 'white', // Ensure white background instead of transparent
    };

    // Cancel any previous render task
    if (renderTaskRef.current) {
      renderTaskRef.current.cancel();
    }

    const renderTask = page.render(renderContext);
    renderTaskRef.current = renderTask;

    renderTask.promise
      .then(() => {
        setIsRendered(true);
        onRenderSuccess?.();
      })
      .catch((err) => {
        if (err.name !== 'RenderingCancelledException') {
          console.error(`Error rendering page ${pageNumber}:`, err);
        }
      });

    return () => {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [page, scale, pageNumber, onRenderSuccess]);

  return (
    <div className={cn('relative w-full h-full flex items-center justify-center bg-white', className)}>
      {!isRendered && (
        <div className="absolute inset-0 skeleton" />
      )}
      <canvas
        ref={canvasRef}
        className={cn(
          'pdf-page-canvas w-full h-full object-contain transition-opacity duration-300',
          isRendered ? 'opacity-100' : 'opacity-0'
        )}
      />
    </div>
  );
}
