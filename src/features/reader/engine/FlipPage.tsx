'use client';

import { forwardRef, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface FlipPageProps {
  pageNumber: number;
  children: ReactNode;
  childrenBack?: ReactNode; // For double-sided pages
  isFlipping?: boolean;
  flipProgress?: number; // 0 to 1
  originX?: 'left' | 'right';
  className?: string;
  zIndex?: number;
}

export const FlipPage = forwardRef<HTMLDivElement, FlipPageProps>(
  (
    {
      pageNumber,
      children,
      childrenBack,
      isFlipping = false,
      flipProgress = 0,
      originX = 'left',
      className,
      zIndex = 1,
    },
    ref
  ) => {
    // Math for the CSS 3D rotation
    // If origin is left, we rotate from 0 to -180deg
    // If origin is right, we rotate from 0 to 180deg (though we usually flip right-to-left, so right page flips to left)
    
    // Default right-to-left flip (origin left on the right page)
    const rotateY = originX === 'left' ? -(flipProgress * 180) : flipProgress * 180;
    
    return (
      <div
        ref={ref}
        className={cn(
          'absolute top-0 w-1/2 h-full flip-page',
          originX === 'left' ? 'right-0' : 'left-0',
          className
        )}
        style={{
          zIndex: isFlipping ? 50 : zIndex, // Bring to front when flipping
          transform: `rotateY(${rotateY}deg)`,
          transformOrigin: originX === 'left' ? 'left center' : 'right center',
        }}
        data-page={pageNumber}
      >
        {/* Front Face */}
        <div className="flip-page-face bg-white shadow-page rounded-r-lg rounded-l-[3px] overflow-hidden">
          <div className="w-full h-full paper-texture">
            {children}
          </div>
          {isFlipping && originX === 'left' && (
            <div 
              className="absolute inset-0 flip-shadow-left"
              style={{ opacity: flipProgress * 0.8 }}
            />
          )}
        </div>

        {/* Back Face */}
        {childrenBack && (
          <div className="flip-page-face flip-page-back bg-white shadow-page rounded-l-lg rounded-r-[3px] overflow-hidden">
            <div className="w-full h-full paper-texture">
              {childrenBack}
            </div>
            {isFlipping && (
              <div 
                className="absolute inset-0 flip-shadow-right"
                style={{ opacity: (1 - flipProgress) * 0.8 }}
              />
            )}
          </div>
        )}
      </div>
    );
  }
);

FlipPage.displayName = 'FlipPage';
