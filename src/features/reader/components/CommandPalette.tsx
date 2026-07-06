'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Search, Home, Library, Settings2, Bookmark, LayoutGrid, Maximize } from 'lucide-react';
import { useReaderStore } from '@/store/useReaderStore';
import { usePreferencesStore } from '@/store/usePreferencesStore';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  toggleFullscreen: () => void;
}

export function CommandPalette({ isOpen, onClose, toggleFullscreen }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { 
    isBookmarksOpen, setIsBookmarksOpen,
    isThumbnailsOpen, setIsThumbnailsOpen
  } = useReaderStore();
  
  const { theme, setTheme } = usePreferencesStore();

  const actions = [
    { id: 'home', label: 'Go to Home', icon: Home, onSelect: () => router.push('/') },
    { id: 'library', label: 'Go to Library', icon: Library, onSelect: () => router.push('/library') },
    { id: 'bookmarks', label: 'Toggle Bookmarks', icon: Bookmark, onSelect: () => setIsBookmarksOpen(!isBookmarksOpen) },
    { id: 'thumbnails', label: 'Toggle Thumbnails', icon: LayoutGrid, onSelect: () => setIsThumbnailsOpen(!isThumbnailsOpen) },
    { id: 'fullscreen', label: 'Toggle Fullscreen', icon: Maximize, onSelect: toggleFullscreen },
    { id: 'theme-dark', label: 'Switch to Dark Theme', icon: Settings2, onSelect: () => setTheme('dark') },
    { id: 'theme-light', label: 'Switch to Light Theme', icon: Settings2, onSelect: () => setTheme('light') },
  ];

  const filteredActions = actions.filter(a => a.label.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleSelect = (onSelect: () => void) => {
    onSelect();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl bg-pf-bg-elevated border-pf-border p-0 overflow-hidden shadow-2xl rounded-2xl top-[20%] translate-y-0">
        <div className="flex items-center px-4 h-14 border-b border-pf-border">
          <Search size={18} className="text-pf-text-tertiary mr-3 shrink-0" />
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 h-full bg-transparent border-none outline-none text-pf-text-primary placeholder:text-pf-text-disabled"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && filteredActions.length > 0) {
                handleSelect(filteredActions[0].onSelect);
              }
            }}
          />
        </div>
        <div className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin">
          {filteredActions.length === 0 ? (
            <div className="py-6 text-center text-sm text-pf-text-tertiary">
              No results found.
            </div>
          ) : (
            filteredActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleSelect(action.onSelect)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-pf-text-secondary hover:bg-pf-bg-subtle hover:text-pf-text-primary transition-colors text-left group"
              >
                <div className="p-1.5 rounded-md bg-pf-bg-card border border-pf-border group-hover:border-pf-border-strong group-hover:text-pf-accent transition-colors">
                  <action.icon size={16} />
                </div>
                {action.label}
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
