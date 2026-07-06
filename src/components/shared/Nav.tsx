'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Library, Home, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/library', label: 'Library', icon: Library },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-14 flex items-center justify-between px-4 sm:px-6 glass border-b border-pf-border">
      <Link href="/" className="flex items-center gap-2 font-bold text-base tracking-tight">
        <div className="w-7 h-7 rounded-lg gradient-accent flex items-center justify-center shadow-lg">
          <BookOpen size={15} className="text-white" />
        </div>
        <span className="gradient-text hidden sm:block">PaperFlow</span>
      </Link>

      <div className="flex items-center gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-1.5 h-8 px-3 rounded-lg text-sm font-medium transition-colors',
              pathname === href
                ? 'bg-pf-accent/10 text-pf-accent'
                : 'text-pf-text-secondary hover:text-pf-text-primary hover:bg-pf-bg-subtle'
            )}
          >
            <Icon size={15} />
            <span className="hidden sm:block">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  // Only show on library & not in reader
  if (pathname.startsWith('/reader')) return null;

  const items = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/library', label: 'Library', icon: Library },
    { href: '/library', label: 'Upload', icon: Upload },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 h-16 glass border-t border-pf-border flex sm:hidden items-center justify-around px-2 pb-safe">
      {items.map(({ href, label, icon: Icon }) => (
        <Link
          key={label}
          href={href}
          className={cn(
            'flex flex-col items-center gap-1 py-2 px-4 rounded-xl text-xs font-medium transition-colors',
            pathname === href
              ? 'text-pf-accent'
              : 'text-pf-text-tertiary'
          )}
        >
          <Icon size={20} />
          {label}
        </Link>
      ))}
    </nav>
  );
}
