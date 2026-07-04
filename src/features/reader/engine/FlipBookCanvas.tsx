'use client';

import { useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { useReaderStore } from '@/store/useReaderStore';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import { AnimationDriver } from './AnimationDriver';
import { FlipPage } from './FlipPage';
import { cn } from '@/utils/cn';

interface FlipBookCanvasProps {
  totalPages: number;
  renderPage: (pageIndex: number) => ReactNode; // Function to render PDF page content
}

export function FlipBookCanvas({ totalPages, renderPage }: FlipBookCanvasProps) {
  const { currentPage, viewMode, setFlipState, setCurrentPage, setIsAnimating } = useReaderStore();
  const { animationStyle } = usePreferencesStore();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const driverRef = useRef<AnimationDriver | null>(null);

  // Local animation state
  const [flippingPage, setFlippingPage] = useState<number | null>(null);
  const [flipProgress, setFlipProgress] = useState(0);
  const [flipDirection, setFlipDirection] = useState<'forward' | 'backward'>('forward');

  // Handle actual page turn logic once animation completes
  const handleFlipComplete = useCallback((direction: 'forward' | 'backward') => {
    setFlippingPage(null);
    setFlipProgress(0);
    setIsAnimating(false);
    setFlipState(null);
    
    if (direction === 'forward') {
      setCurrentPage(Math.min(currentPage + (viewMode === 'double' ? 2 : 1), totalPages));
    } else {
      setCurrentPage(Math.max(currentPage - (viewMode === 'double' ? 2 : 1), 1));
    }
  }, [currentPage, viewMode, totalPages, setCurrentPage, setIsAnimating, setFlipState]);

  // Flip trigger
  const triggerFlip = useCallback((direction: 'forward' | 'backward') => {
    if (flippingPage !== null) return; // Already flipping
    
    // Check boundaries
    if (direction === 'forward' && currentPage >= totalPages) return;
    if (direction === 'backward' && currentPage <= 1) return;

    setFlipDirection(direction);
    setFlippingPage(currentPage);
    setIsAnimating(true);
    
    // Play page flip sound (synthesized for simplicity)
    const { soundEnabled } = usePreferencesStore.getState();
    if (soundEnabled) {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square'; // 'sine' or 'triangle' also work, 'square' is sharper
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } catch (e) {
        // Audio API not supported or blocked
      }
    }
    
    const driver = new AnimationDriver(
      animationStyle,
      (progress) => {
        setFlipProgress(progress);
        setFlipState({
          pageIndex: currentPage,
          flipProgress: progress,
          state: direction === 'forward' ? 'flipping-forward' : 'flipping-backward',
          originX: direction === 'forward' ? 'left' : 'right',
        });
      },
      () => handleFlipComplete(direction)
    );
    
    driverRef.current = driver;
    // For backward flip, we start at 1 and animate to 0. For forward, 0 to 1.
    // Actually, it's easier to always animate 0 to 1 and let FlipPage handle the rotation math.
    driver.animate(0, 1);
    
  }, [currentPage, totalPages, flippingPage, animationStyle, setIsAnimating, setFlipState, handleFlipComplete]);

  // Cleanup
  useEffect(() => {
    return () => {
      driverRef.current?.destroy();
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        triggerFlip('forward');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        triggerFlip('backward');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerFlip]);

  // Determine pages to render
  const leftPageNum = viewMode === 'double' ? (currentPage % 2 === 0 ? currentPage : currentPage - 1) : currentPage;
  const rightPageNum = viewMode === 'double' ? leftPageNum + 1 : currentPage;

  const nextRightPageNum = rightPageNum + 2;
  const prevLeftPageNum = Math.max(leftPageNum - 2, 0);

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8">
      <div 
        ref={containerRef}
        className={cn(
          "flip-container relative w-full h-full max-w-5xl aspect-[2/1.4] mx-auto",
          viewMode === 'single' && "max-w-2xl aspect-[1/1.4]"
        )}
      >
        {viewMode === 'double' && (
          <>
            {/* Background pages (what's revealed underneath) */}
            {prevLeftPageNum > 0 && (
              <div className="absolute left-0 top-0 w-1/2 h-full bg-white shadow-page rounded-l-lg rounded-r-[3px] overflow-hidden z-0">
                {renderPage(prevLeftPageNum)}
              </div>
            )}
            {nextRightPageNum <= totalPages && (
              <div className="absolute right-0 top-0 w-1/2 h-full bg-white shadow-page rounded-r-lg rounded-l-[3px] overflow-hidden z-0">
                {renderPage(nextRightPageNum)}
              </div>
            )}

            {/* Current Left Page (Static unless flipping backward) */}
            {leftPageNum > 0 && (
              <FlipPage
                pageNumber={leftPageNum}
                originX="right"
                zIndex={10}
                isFlipping={flippingPage !== null && flipDirection === 'backward'}
                flipProgress={flipDirection === 'backward' ? flipProgress : 0}
                childrenBack={renderPage(prevLeftPageNum)}
                className="left-0"
              >
                {renderPage(leftPageNum)}
              </FlipPage>
            )}

            {/* Current Right Page (Static unless flipping forward) */}
            {rightPageNum <= totalPages && (
              <FlipPage
                pageNumber={rightPageNum}
                originX="left"
                zIndex={10}
                isFlipping={flippingPage !== null && flipDirection === 'forward'}
                flipProgress={flipDirection === 'forward' ? flipProgress : 0}
                childrenBack={renderPage(nextRightPageNum)}
                className="right-0"
              >
                {renderPage(rightPageNum)}
              </FlipPage>
            )}
          </>
        )}

        {/* Interaction overlays for click-to-flip */}
        <div 
          className="absolute left-0 top-0 w-1/4 h-full z-40 cursor-pointer"
          onClick={() => triggerFlip('backward')}
        />
        <div 
          className="absolute right-0 top-0 w-1/4 h-full z-40 cursor-pointer"
          onClick={() => triggerFlip('forward')}
        />
      </div>
    </div>
  );
}
