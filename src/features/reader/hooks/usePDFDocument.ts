/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import type { PDFDocumentProxy } from 'pdfjs-dist';

export function usePDFDocument(url: string | null) {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!url) {
      setTimeout(() => {
        setPdf(null);
        setIsLoading(false);
      }, 0);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);
    let loadingTask: ReturnType<typeof import('pdfjs-dist').getDocument> | null = null;

    import('pdfjs-dist').then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      loadingTask = pdfjs.getDocument(url);

      loadingTask.promise
        .then((loadedPdf: PDFDocumentProxy) => {
        if (isMounted) {
          setPdf(loadedPdf);
          setIsLoading(false);
        }
      })
      .catch((err: Error) => {
        if (isMounted) {
          console.error('Failed to load PDF:', err);
          setError(err);
          setIsLoading(false);
        }
      });
    });

    return () => {
      isMounted = false;
      if (loadingTask) loadingTask.destroy();
    };
  }, [url]);

  return { pdf, isLoading, error };
}
