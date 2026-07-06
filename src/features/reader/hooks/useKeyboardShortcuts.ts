import { useEffect } from 'react';
import { useReaderStore } from '@/store/useReaderStore';

export function useKeyboardShortcuts(
  toggleFullscreen: () => void,
  zoomIn: () => void,
  zoomOut: () => void,
  resetZoom: () => void,
  fitWidth: () => void,
  triggerFlip: (direction: 'forward' | 'backward') => void,
  setIsCommandPaletteOpen: (open: boolean) => void,
  setIsShortcutsHelpOpen: (open: boolean) => void
) {
  const { 
    isBookmarksOpen, setIsBookmarksOpen,
    isThumbnailsOpen, setIsThumbnailsOpen
  } = useReaderStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      // Navigation
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        triggerFlip('forward');
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        triggerFlip('backward');
      }
      
      // Zoom
      else if ((e.ctrlKey || e.metaKey) && e.key === '=') {
        e.preventDefault();
        zoomIn();
      } else if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault();
        zoomOut();
      } else if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        resetZoom();
      } else if (e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        fitWidth();
      }
      
      // Fullscreen
      else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
      
      // Sidebars
      else if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        setIsBookmarksOpen(!isBookmarksOpen);
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        setIsThumbnailsOpen(!isThumbnailsOpen);
      }
      
      // Command Palette
      else if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
      
      // Shortcuts Help
      else if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsHelpOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    triggerFlip, toggleFullscreen, zoomIn, zoomOut, resetZoom, fitWidth,
    isBookmarksOpen, setIsBookmarksOpen, isThumbnailsOpen, setIsThumbnailsOpen,
    setIsCommandPaletteOpen, setIsShortcutsHelpOpen
  ]);
}
