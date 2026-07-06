'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { group: 'Navigation', items: [
    { keys: ['→', 'Space', 'PgDn'], label: 'Next Page' },
    { keys: ['←', 'PgUp'], label: 'Previous Page' },
  ]},
  { group: 'Zoom & View', items: [
    { keys: ['Ctrl', '='], label: 'Zoom In' },
    { keys: ['Ctrl', '-'], label: 'Zoom Out' },
    { keys: ['Ctrl', '0'], label: 'Reset Zoom' },
    { keys: ['W'], label: 'Fit Width' },
    { keys: ['F'], label: 'Toggle Fullscreen' },
  ]},
  { group: 'Panels & Settings', items: [
    { keys: ['B'], label: 'Toggle Bookmarks' },
    { keys: ['T'], label: 'Toggle Thumbnails' },
    { keys: ['Ctrl', 'K'], label: 'Command Palette' },
    { keys: ['?'], label: 'Show Shortcuts Help' },
  ]}
];

export function ShortcutsHelp({ isOpen, onClose }: ShortcutsHelpProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-pf-bg-elevated border-pf-border p-0 overflow-hidden shadow-2xl rounded-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-pf-border bg-pf-bg-subtle/50">
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="p-6 space-y-6">
          {SHORTCUTS.map((section) => (
            <div key={section.group}>
              <h3 className="text-xs font-semibold text-pf-text-tertiary uppercase tracking-wider mb-3">
                {section.group}
              </h3>
              <ul className="space-y-3">
                {section.items.map((shortcut) => (
                  <li key={shortcut.label} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-pf-text-primary">
                      {shortcut.label}
                    </span>
                    <div className="flex gap-1.5">
                      {shortcut.keys.map((k) => (
                        <kbd key={k} className="px-2 py-1 bg-pf-bg-card border border-pf-border rounded-md text-[11px] font-medium text-pf-text-secondary shadow-sm">
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
