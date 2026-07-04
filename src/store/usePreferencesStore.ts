import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AnimationStyle, ReaderPreferences, SoundPack, ViewMode, ReadingDirection } from '@/types';

interface PreferencesState extends ReaderPreferences {
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  setZoomLevel: (zoom: number) => void;
  setAnimationStyle: (style: AnimationStyle) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setSoundPack: (pack: SoundPack) => void;
  setVolume: (volume: number) => void;
  setViewMode: (mode: ViewMode) => void;
  setReadingDirection: (dir: ReadingDirection) => void;
  setToolbarVisible: (visible: boolean) => void;
  setAutoHideToolbar: (autoHide: boolean) => void;
  reset: () => void;
}

const DEFAULT_PREFERENCES: ReaderPreferences = {
  theme: 'dark',
  zoomLevel: 1,
  animationStyle: 'book',
  soundEnabled: true,
  soundPack: 'classic',
  volume: 0.6,
  viewMode: 'double',
  readingDirection: 'ltr',
  toolbarVisible: true,
  autoHideToolbar: true,
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      ...DEFAULT_PREFERENCES,

      setTheme: (theme) => set({ theme }),
      setZoomLevel: (zoomLevel) => set({ zoomLevel }),
      setAnimationStyle: (animationStyle) => set({ animationStyle }),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      setSoundPack: (soundPack) => set({ soundPack }),
      setVolume: (volume) => set({ volume }),
      setViewMode: (viewMode) => set({ viewMode }),
      setReadingDirection: (readingDirection) => set({ readingDirection }),
      setToolbarVisible: (toolbarVisible) => set({ toolbarVisible }),
      setAutoHideToolbar: (autoHideToolbar) => set({ autoHideToolbar }),
      reset: () => set(DEFAULT_PREFERENCES),
    }),
    {
      name: 'paperflow-preferences',
      version: 1,
    }
  )
);
