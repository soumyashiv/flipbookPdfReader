import { useState, useEffect, useRef } from 'react';
import { useReaderStore } from '@/store/useReaderStore';

export function useReadingTimer() {
  const { currentPage, totalPages } = useReaderStore();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [estimatedRemaining, setEstimatedRemaining] = useState<number | null>(null);
  const lastPageChangeTime = useRef<number>(Date.now());
  const pageTimes = useRef<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const now = Date.now();
    const timeSpentOnPrevPage = (now - lastPageChangeTime.current) / 1000;
    
    // Only record if it's a reasonable time (e.g. between 2 seconds and 5 minutes)
    // to avoid skewing the average with afk times or skipping pages
    if (timeSpentOnPrevPage > 2 && timeSpentOnPrevPage < 300) {
      pageTimes.current.push(timeSpentOnPrevPage);
      if (pageTimes.current.length > 10) {
        pageTimes.current.shift(); // Keep last 10 pages for moving average
      }
    }

    lastPageChangeTime.current = now;

    if (pageTimes.current.length > 0 && totalPages > 0) {
      const avgTimePerPage = pageTimes.current.reduce((a, b) => a + b, 0) / pageTimes.current.length;
      const pagesRemaining = Math.max(0, totalPages - currentPage);
      setEstimatedRemaining(Math.round(avgTimePerPage * pagesRemaining));
    }
  }, [currentPage, totalPages]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    
    if (h > 0) {
      return `${h}h ${m}m`;
    }
    return `${m}m`;
  };

  return {
    elapsedTimeFormatted: formatTime(elapsedSeconds),
    estimatedRemainingFormatted: estimatedRemaining !== null ? formatTime(estimatedRemaining) : '--',
  };
}
