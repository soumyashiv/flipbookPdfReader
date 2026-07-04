import { create } from 'zustand';
import type { LibraryFilters, SortBy, LibraryView } from '@/types';

interface LibraryState extends LibraryFilters {
  selectedBookId: string | null;
  isUploadOpen: boolean;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: SortBy) => void;
  setView: (view: LibraryView) => void;
  setShowFavoritesOnly: (show: boolean) => void;
  setSelectedBookId: (id: string | null) => void;
  setIsUploadOpen: (open: boolean) => void;
}

export const useLibraryStore = create<LibraryState>()((set) => ({
  sortBy: 'recent',
  view: 'grid',
  searchQuery: '',
  showFavoritesOnly: false,
  selectedBookId: null,
  isUploadOpen: false,

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSortBy: (sortBy) => set({ sortBy }),
  setView: (view) => set({ view }),
  setShowFavoritesOnly: (showFavoritesOnly) => set({ showFavoritesOnly }),
  setSelectedBookId: (selectedBookId) => set({ selectedBookId }),
  setIsUploadOpen: (isUploadOpen) => set({ isUploadOpen }),
}));
