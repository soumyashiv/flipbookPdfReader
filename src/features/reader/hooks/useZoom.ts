import { useState, useCallback, useEffect, useRef } from 'react';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import { useReaderStore } from '@/store/useReaderStore';

const ZOOM_PRESETS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 4;

export function useZoom(containerRef: React.RefObject<HTMLElement | null>) {
  const { zoomLevel, setZoomLevel } = usePreferencesStore();
  const [pinchStart, setPinchStart] = useState<{ dist: number; zoom: number } | null>(null);
  const swipeStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const zoomTo = useCallback((level: number) => {
    const clamped = Math.min(Math.max(level, MIN_ZOOM), MAX_ZOOM);
    setZoomLevel(Math.round(clamped * 100) / 100);
  }, [setZoomLevel]);

  const zoomIn = useCallback(() => {
    const next = ZOOM_PRESETS.find((p) => p > zoomLevel) ?? MAX_ZOOM;
    zoomTo(next);
  }, [zoomLevel, zoomTo]);

  const zoomOut = useCallback(() => {
    const next = [...ZOOM_PRESETS].reverse().find((p) => p < zoomLevel) ?? MIN_ZOOM;
    zoomTo(next);
  }, [zoomLevel, zoomTo]);

  const resetZoom = useCallback(() => zoomTo(1), [zoomTo]);

  const fitWidth = useCallback(() => {
    if (!containerRef.current) return;
    const containerW = containerRef.current.offsetWidth;
    const pageW = containerW * 0.48; // approx half for double-page
    zoomTo(containerW / pageW);
  }, [containerRef, zoomTo]);

  // Mouse wheel zoom (Ctrl + wheel)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.1 : -0.1;
      const currentZoom = usePreferencesStore.getState().zoomLevel;
      const next = Math.min(Math.max(currentZoom + delta, MIN_ZOOM), MAX_ZOOM);
      setZoomLevel(Math.round(next * 100) / 100);
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [containerRef, setZoomLevel]);

  // Pinch-to-zoom touch events
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setPinchStart({ dist, zoom: zoomLevel });
      swipeStartRef.current = null; // Cancel swipe if pinch starts
    } else if (e.touches.length === 1) {
      swipeStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
    }
  }, [zoomLevel]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStart) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scale = dist / pinchStart.dist;
      zoomTo(pinchStart.zoom * scale);
    }
  }, [pinchStart, zoomTo]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    setPinchStart(null);

    // Process swipe using changedTouches from the React event
    if (swipeStartRef.current && e.changedTouches.length > 0) {
      const touch = e.changedTouches[0];
      const dx = touch.clientX - swipeStartRef.current.x;
      const dy = touch.clientY - swipeStartRef.current.y;
      const dt = Date.now() - swipeStartRef.current.time;

      // Fast horizontal swipe (>50px, more horizontal than vertical, <300ms)
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) && dt < 300) {
        const { triggerFlip } = useReaderStore.getState();
        if (dx < 0) {
          triggerFlip('forward');
        } else {
          triggerFlip('backward');
        }
      }
    }
    swipeStartRef.current = null;
  }, []);

  return {
    zoomLevel,
    zoomIn,
    zoomOut,
    resetZoom,
    fitWidth,
    zoomTo,
    ZOOM_PRESETS,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
