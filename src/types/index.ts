// ─── Core Domain Types ─────────────────────────────────────────────────────

export interface Book {
  id: string;
  title: string;
  fileName: string;
  fileSize: number;
  totalPages: number;
  coverPage: number;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  bookmarks?: Bookmark[];
  progress?: ReadingProgress | null;
}

export interface Bookmark {
  id: string;
  bookId: string;
  pageNumber: number;
  label: string | null;
  createdAt: Date;
}

export interface ReadingProgress {
  id: string;
  bookId: string;
  currentPage: number;
  timeSpentSeconds: number;
  lastOpenedAt: Date;
  updatedAt: Date;
}

// ─── Reader Types ───────────────────────────────────────────────────────────

export type ViewMode = 'single' | 'double';
export type ReadingDirection = 'ltr' | 'rtl';

export type AnimationStyle =
  | 'hardcover'
  | 'magazine'
  | 'book'
  | 'notebook'
  | 'minimal'
  | 'softCurl'
  | 'fastFlip'
  | 'elasticFlip'
  | 'vintagePaper'
  | 'luxuryMagazine';

export type ReaderTheme = 'dark' | 'light' | 'sepia' | 'paper' | 'amoled' | 'high-contrast';

export interface AnimationConfig {
  style: AnimationStyle;
  duration: number;
  easing: string;
  shadowIntensity: number;
  perspective: number;
}

export type SoundPack = 'classic' | 'soft' | 'magazine';

export interface ReaderPreferences {
  theme: 'dark' | 'light' | 'system';
  readerTheme: ReaderTheme;
  zoomLevel: number;
  animationStyle: AnimationStyle;
  animationSpeed: number; // 0.5x to 2x multiplier
  soundEnabled: boolean;
  soundPack: SoundPack;
  volume: number;
  viewMode: ViewMode;
  readingDirection: ReadingDirection;
  toolbarVisible: boolean;
  autoHideToolbar: boolean;
  reducedMotion: boolean;
  pageBackground: 'white' | 'cream' | 'gray';
}

// ─── Flip Engine Types ──────────────────────────────────────────────────────

export type FlipState = 'idle' | 'flipping-forward' | 'flipping-backward' | 'dragging';

export interface FlipPageState {
  pageIndex: number;
  flipProgress: number; // 0 → 1 (0 = start, 1 = complete)
  state: FlipState;
  originX: 'left' | 'right';
}

export interface FlipBookState {
  currentPage: number;
  totalPages: number;
  viewMode: ViewMode;
  isAnimating: boolean;
  flipState: FlipPageState | null;
  zoomLevel: number;
  isFullscreen: boolean;
}

// ─── Upload Types ───────────────────────────────────────────────────────────

export type UploadStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

export interface UploadState {
  status: UploadStatus;
  progress: number;
  error: string | null;
  bookId: string | null;
}

// ─── Library Types ──────────────────────────────────────────────────────────

export type SortBy = 'recent' | 'name' | 'favorites';
export type LibraryView = 'grid' | 'list';

export interface LibraryFilters {
  sortBy: SortBy;
  view: LibraryView;
  searchQuery: string;
  showFavoritesOnly: boolean;
}

// ─── Search Types ───────────────────────────────────────────────────────────

export interface SearchResult {
  pageNumber: number;
  text: string;
  matchIndex: number;
  context: string;
}

// ─── API Response Types ─────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}
