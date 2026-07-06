import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AnimationStyle, ReaderPreferences, ReaderTheme, SoundPack, ViewMode, ReadingDirection } from '@/types';

interface PreferencesState extends ReaderPreferences {
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  setReaderTheme: (theme: ReaderTheme) => void;
  setZoomLevel: (zoom: number) => void;
  setAnimationStyle: (style: AnimationStyle) => void;
  setAnimationSpeed: (speed: number) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setSoundPack: (pack: SoundPack) => void;
  setVolume: (volume: number) => void;
  setViewMode: (mode: ViewMode) => void;
  setReadingDirection: (dir: ReadingDirection) => void;
  setToolbarVisible: (visible: boolean) => void;
  setAutoHideToolbar: (autoHide: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  setPageBackground: (bg: 'white' | 'cream' | 'gray') => void;
  reset: () => void;
}

const DEFAULT_PREFERENCES: ReaderPreferences = {
  theme: 'dark',
  readerTheme: 'dark',
  zoomLevel: 1,
  animationStyle: 'book',
  animationSpeed: 1,
  soundEnabled: true,
  soundPack: 'classic',
  volume: 0.6,
  viewMode: 'double',
  readingDirection: 'ltr',
  toolbarVisible: true,
  autoHideToolbar: true,
  reducedMotion: false,
  pageBackground: 'white',
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      ...DEFAULT_PREFERENCES,

      setTheme: (theme) => set({ theme }),
      setReaderTheme: (readerTheme) => set({ readerTheme }),
      setZoomLevel: (zoomLevel) => set({ zoomLevel }),
      setAnimationStyle: (animationStyle) => set({ animationStyle }),
      setAnimationSpeed: (animationSpeed) => set({ animationSpeed }),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      setSoundPack: (soundPack) => set({ soundPack }),
      setVolume: (volume) => set({ volume }),
      setViewMode: (viewMode) => set({ viewMode }),
      setReadingDirection: (readingDirection) => set({ readingDirection }),
      setToolbarVisible: (toolbarVisible) => set({ toolbarVisible }),
      setAutoHideToolbar: (autoHideToolbar) => set({ autoHideToolbar }),
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
      setPageBackground: (pageBackground) => set({ pageBackground }),
      reset: () => set(DEFAULT_PREFERENCES),
    }),
    {
      name: 'paperflow-preferences',
      version: 2,
    }
  )
);
