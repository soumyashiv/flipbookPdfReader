import type { Metadata, Viewport } from 'next';

import { Providers } from '@/components/providers';
import '@/app/globals.css';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: {
    default: 'PaperFlow — Premium FlipBook Reader',
    template: '%s | PaperFlow',
  },
  description:
    'Transform your PDFs into beautiful interactive flipbooks. PaperFlow delivers a premium digital reading experience with smooth GPU-accelerated page animations, bookmarks, search, and more.',
  keywords: [
    'flipbook',
    'PDF reader',
    'digital flipbook',
    'page flip',
    'PDF viewer',
    'online reader',
    'book reader',
  ],
  authors: [{ name: 'PaperFlow' }],
  creator: 'PaperFlow',
  manifest: '/manifest.json',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  ),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'PaperFlow — Premium FlipBook Reader',
    description:
      'Transform your PDFs into beautiful interactive flipbooks with smooth animations.',
    siteName: 'PaperFlow',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PaperFlow — Premium FlipBook Reader',
    description:
      'Transform your PDFs into beautiful interactive flipbooks with smooth animations.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#08090c' },
    { media: '(prefers-color-scheme: light)', color: '#fafbfc' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn("font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
