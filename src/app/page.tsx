import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Upload, Sparkles, ArrowRight, Zap, Shield, Smartphone, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'PaperFlow — Premium FlipBook Reader',
  description: 'Transform your PDFs into beautiful interactive flipbooks with smooth GPU-accelerated page animations, bookmarks, and more.',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-pf-bg-base text-pf-text-primary overflow-hidden">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 inset-x-0 z-50 h-16 flex items-center justify-between px-6 md:px-10 glass border-b border-pf-border">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center shadow-lg">
            <BookOpen size={18} className="text-white" />
          </div>
          <span className="gradient-text">PaperFlow</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/library"
            className="hidden sm:flex items-center gap-2 text-sm text-pf-text-secondary hover:text-pf-text-primary transition-colors"
          >
            My Library
          </Link>
          <Link
            href="/library"
            className="flex items-center gap-2 h-9 px-4 rounded-xl gradient-accent text-white text-sm font-medium shadow-accent hover:opacity-90 transition-opacity"
          >
            <BookOpen size={16} />
            <span>Open Library</span>
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 px-6 flex flex-col items-center text-center overflow-hidden">
        {/* Background glow orbs */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-pf-accent/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-[300px] h-[300px] rounded-full bg-pf-accent-from/8 blur-[80px] pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-[300px] h-[300px] rounded-full bg-pf-accent-to/8 blur-[80px] pointer-events-none" />

        {/* Badge */}
        <div className="relative mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-pf-border bg-pf-bg-elevated text-xs font-medium text-pf-text-secondary animate-fade-down">
          <Sparkles size={12} className="text-pf-accent" />
          Beautiful flipbook experience for your PDFs
        </div>

        {/* Headline */}
        <h1 className="relative text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.07] tracking-tight max-w-4xl animate-fade-up" style={{ animationDelay: '80ms' }}>
          Your PDFs.{' '}
          <span className="gradient-text">Alive.</span>
        </h1>

        <p className="relative mt-6 text-lg sm:text-xl text-pf-text-secondary max-w-xl leading-relaxed animate-fade-up" style={{ animationDelay: '140ms' }}>
          Transform any PDF into a stunning interactive flipbook. Realistic page-turn animations, bookmarks, multiple themes — all running at 60 FPS.
        </p>

        {/* CTA Buttons */}
        <div className="relative mt-10 flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: '200ms' }}>
          <Link
            href="/library"
            className="group flex items-center justify-center gap-2 h-12 px-8 rounded-2xl gradient-accent text-white font-semibold shadow-accent hover:opacity-90 transition-opacity"
          >
            <BookOpen size={18} />
            Open My Library
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/library"
            className="flex items-center justify-center gap-2 h-12 px-8 rounded-2xl border border-pf-border bg-pf-bg-elevated text-pf-text-primary font-semibold hover:bg-pf-bg-subtle hover:border-pf-border-strong transition-colors"
          >
            <Upload size={18} />
            Upload a PDF
          </Link>
        </div>

        {/* Book mockup */}
        <div className="relative mt-16 w-full max-w-3xl animate-fade-up" style={{ animationDelay: '280ms' }}>
          <div className="relative mx-auto w-full max-w-2xl aspect-[16/9] rounded-2xl overflow-hidden border border-pf-border bg-pf-bg-card shadow-2xl">
            {/* Fake reader UI */}
            <div className="h-10 bg-pf-bg-elevated border-b border-pf-border flex items-center px-4 gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 h-5 rounded bg-pf-bg-subtle" />
            </div>
            <div className="flex h-full">
              {/* Left page */}
              <div className="flex-1 bg-[#fefefe] border-r border-gray-200 p-4 flex flex-col gap-2">
                <div className="h-2 rounded bg-gray-200 w-3/4" />
                <div className="h-2 rounded bg-gray-200 w-full" />
                <div className="h-2 rounded bg-gray-200 w-5/6" />
                <div className="h-2 rounded bg-gray-200 w-full" />
                <div className="h-2 rounded bg-gray-200 w-2/3" />
                <div className="mt-2 h-20 rounded bg-gray-100 w-full" />
                <div className="h-2 rounded bg-gray-200 w-full" />
                <div className="h-2 rounded bg-gray-200 w-4/5" />
              </div>
              {/* Right page (flipping) */}
              <div className="flex-1 bg-[#fefefe] p-4 flex flex-col gap-2">
                <div className="h-2 rounded bg-gray-200 w-full" />
                <div className="h-2 rounded bg-gray-200 w-3/4" />
                <div className="h-2 rounded bg-gray-200 w-full" />
                <div className="mt-2 h-16 rounded bg-gray-100 w-full" />
                <div className="h-2 rounded bg-gray-200 w-5/6" />
                <div className="h-2 rounded bg-gray-200 w-full" />
                <div className="h-2 rounded bg-gray-200 w-1/2" />
              </div>
            </div>
          </div>
          {/* Floating badges */}
          <div className="absolute -top-4 -right-4 sm:right-4 bg-pf-bg-card border border-pf-border rounded-xl px-4 py-2 shadow-lg text-xs font-medium text-pf-text-primary flex items-center gap-2 animate-float">
            <Zap size={12} className="text-pf-accent" />
            60 FPS animations
          </div>
          <div className="absolute -bottom-4 -left-4 sm:left-4 bg-pf-bg-card border border-pf-border rounded-xl px-4 py-2 shadow-lg text-xs font-medium text-pf-text-primary flex items-center gap-2 animate-float" style={{ animationDelay: '1.5s' }}>
            <Shield size={12} className="text-pf-success" />
            Local storage — private
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold">Everything you need to read beautifully</h2>
          <p className="mt-3 text-pf-text-secondary">Built for speed, elegance, and focus.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="group relative p-6 rounded-2xl bg-pf-bg-card border border-pf-border hover:border-pf-accent/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center mb-4 shadow-accent group-hover:scale-110 transition-transform">
                <f.icon size={20} className="text-white" />
              </div>
              <h3 className="font-semibold text-pf-text-primary mb-1">{f.title}</h3>
              <p className="text-sm text-pf-text-secondary leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-14">Get started in seconds</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {STEPS.map((s, i) => (
            <div key={s.label} className="flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-2xl gradient-accent flex items-center justify-center text-white text-2xl font-black shadow-accent">
                {i + 1}
              </div>
              <h3 className="font-semibold">{s.label}</h3>
              <p className="text-sm text-pf-text-secondary">{s.desc}</p>
              {i < 2 && <ChevronRight size={20} className="text-pf-text-tertiary sm:hidden" />}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-6">
        <div className="relative max-w-3xl mx-auto rounded-3xl overflow-hidden text-center px-8 py-16 gradient-accent shadow-accent">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15),transparent_70%)]" />
          <h2 className="relative text-3xl sm:text-4xl font-extrabold text-white mb-4">Start reading beautifully</h2>
          <p className="relative text-white/80 mb-8 max-w-sm mx-auto">Upload any PDF and experience it as a stunning flipbook — for free, forever.</p>
          <Link
            href="/library"
            className="relative inline-flex items-center gap-2 bg-white text-pf-accent-from font-bold px-8 py-3 rounded-2xl hover:opacity-95 transition-opacity shadow-lg"
          >
            <BookOpen size={18} />
            Open Library
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-pf-border py-8 px-6 text-center text-xs text-pf-text-tertiary">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-5 h-5 rounded gradient-accent flex items-center justify-center">
            <BookOpen size={12} className="text-white" />
          </div>
          <span className="font-semibold text-pf-text-secondary">PaperFlow</span>
        </div>
        All your books stay local — your data never leaves your device.
      </footer>
    </div>
  );
}

const FEATURES = [
  { icon: Zap, title: 'Realistic Page Flip', desc: '10 animation styles including Hardcover, Magazine, Soft Curl and Vintage Paper — all GPU-accelerated.' },
  { icon: BookOpen, title: 'Beautiful Reader', desc: 'Single & double-page spread, zoom, fullscreen, auto-hide toolbar, reading timer, and progress bar.' },
  { icon: Shield, title: 'Fully Local', desc: 'Your PDFs are stored locally in your browser — nothing is sent to any server.' },
  { icon: Smartphone, title: 'Mobile Ready', desc: 'Swipe to flip pages, pinch to zoom, and double-tap to fit. Responsive on any screen size.' },
  { icon: Sparkles, title: 'Themes', desc: 'Dark, Light, Sepia, Paper, AMOLED and High-Contrast modes. Set it once, read forever.' },
  { icon: Upload, title: 'Drag & Drop Upload', desc: 'Drop any PDF file, or click to browse. Supports files up to 50 MB with progress tracking.' },
];

const STEPS = [
  { label: 'Upload', desc: 'Drag and drop any PDF into the library, or click to browse.' },
  { label: 'Open', desc: 'Click any book to open it instantly in the flipbook reader.' },
  { label: 'Read', desc: 'Flip through pages with beautiful animations and save your progress.' },
];
