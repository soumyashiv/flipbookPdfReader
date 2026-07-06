import { Navbar, MobileNav } from '@/components/shared/Nav';
import type { ReactNode } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-14 pb-16 sm:pb-0">
        {children}
      </main>
      <MobileNav />
    </>
  );
}
