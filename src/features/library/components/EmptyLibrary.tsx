'use client';

import { motion } from 'motion/react';
import { UploadDropzone } from '@/features/upload/components/UploadDropzone';
import { BookOpen } from 'lucide-react';

export function EmptyLibrary() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="flex flex-col items-center justify-center py-16 px-4 max-w-xl mx-auto text-center"
    >
      <div className="w-24 h-24 bg-pf-accent/10 rounded-full flex items-center justify-center mb-6 relative">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
        >
          <BookOpen size={48} className="text-pf-accent" />
        </motion.div>
        <div className="absolute inset-0 bg-pf-accent/5 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
      </div>
      
      <h2 className="text-2xl font-bold text-pf-text-primary mb-2">Your library is empty</h2>
      <p className="text-pf-text-secondary mb-8 leading-relaxed">
        Upload your first PDF book to start building your personal digital library and experience reading like never before.
      </p>
      
      <UploadDropzone />
    </motion.div>
  );
}
