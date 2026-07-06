'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface SidebarPanelProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  side?: 'left' | 'right';
  width?: string;
}

export function SidebarPanel({ 
  title, 
  isOpen, 
  onClose, 
  children,
  side = 'left',
  width = 'w-80'
}: SidebarPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop (mobile only usually, but let's keep it subtle or transparent if we want side-by-side) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/10 sm:hidden"
          />

          <motion.aside
            initial={{ x: side === 'left' ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: side === 'left' ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed top-16 bottom-0 z-40 ${width} bg-pf-bg-elevated border-pf-border shadow-2xl flex flex-col ${
              side === 'left' ? 'left-0 border-r' : 'right-0 border-l'
            }`}
          >
            <div className="flex items-center justify-between px-4 h-14 border-b border-pf-border shrink-0">
              <h2 className="font-semibold text-pf-text-primary">{title}</h2>
              <button 
                onClick={onClose}
                className="p-2 -mr-2 rounded-lg text-pf-text-secondary hover:text-pf-text-primary hover:bg-pf-bg-subtle transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 scrollbar-thin">
              {children}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
