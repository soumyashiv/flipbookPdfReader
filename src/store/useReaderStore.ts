import { create } from 'zustand';
import type { FlipBookState, FlipPageState, ViewMode } from '@/types';

interface ReaderState extends FlipBookState {
  bookId: string | null;
  isSearchOpen: boolean;
  isThumbnailsOpen: boolean;
  isBookmarksOpen: boolean;
  isSettingsOpen: boolean;

  // Actions
  setBookId: (id: string) => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (total: number) => void;
  setIsAnimating: (animating: boolean) => void;
  setFlipState: (state: FlipPageState | null) => void;
  setZoomLevel: (zoom: number) => void;
  setViewMode: (mode: ViewMode) => void;
  setIsFullscreen: (fullscreen: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  setIsThumbnailsOpen: (open: boolean) => void;
  setIsBookmarksOpen: (open: boolean) => void;
  setIsSettingsOpen: (open: boolean) => void;
  closeSidebars: () => void;
  goToNextPage: () => void;
  goToPrevPage: () => void;
  triggerFlip: (direction: 'forward' | 'backward') => void;
  setTriggerFlip: (fn: (direction: 'forward' | 'backward') => void) => void;
  reset: () => void;
}

const DEFAULT_STATE: FlipBookState & {
  bookId: string | null;
  isSearchOpen: boolean;
  isThumbnailsOpen: boolean;
  isBookmarksOpen: boolean;
  isSettingsOpen: boolean;
  triggerFlip: (direction: 'forward' | 'backward') => void;
} = {
  bookId: null,
  currentPage: 1,
  totalPages: 0,
  viewMode: 'double',
  isAnimating: false,
  flipState: null,
  zoomLevel: 1,
  isFullscreen: false,
  isSearchOpen: false,
  isThumbnailsOpen: false,
  isBookmarksOpen: false,
  isSettingsOpen: false,
  triggerFlip: () => {},
};

export const useReaderStore = create<ReaderState>()((set, get) => ({
  ...DEFAULT_STATE,

  setBookId: (bookId) => set({ bookId }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setTotalPages: (totalPages) => set({ totalPages }),
  setIsAnimating: (isAnimating) => set({ isAnimating }),
  setFlipState: (flipState) => set({ flipState }),
  setZoomLevel: (zoomLevel) => set({ zoomLevel }),
  setViewMode: (viewMode) => set({ viewMode }),
  setIsFullscreen: (isFullscreen) => set({ isFullscreen }),
  setIsSearchOpen: (isSearchOpen) => set({ isSearchOpen }),
  setIsThumbnailsOpen: (isThumbnailsOpen) => set({ isThumbnailsOpen }),
  setIsBookmarksOpen: (isBookmarksOpen) => set({ isBookmarksOpen }),
  setIsSettingsOpen: (isSettingsOpen) => set({ isSettingsOpen }),
  setTriggerFlip: (triggerFlip) => set({ triggerFlip }),

  closeSidebars: () =>
    set({
      isSearchOpen: false,
      isThumbnailsOpen: false,
      isBookmarksOpen: false,
      isSettingsOpen: false,
    }),

  goToNextPage: () => {
    const { currentPage, totalPages, viewMode, isAnimating } = get();
    if (isAnimating) return;
    const increment = viewMode === 'double' ? 2 : 1;
    const next = Math.min(currentPage + increment, totalPages);
    if (next !== currentPage) set({ currentPage: next });
  },

  goToPrevPage: () => {
    const { currentPage, viewMode, isAnimating } = get();
    if (isAnimating) return;
    const decrement = viewMode === 'double' ? 2 : 1;
    const prev = Math.max(currentPage - decrement, 1);
    if (prev !== currentPage) set({ currentPage: prev });
  },

  reset: () => set(DEFAULT_STATE),
}));
