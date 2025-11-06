'use client';

import { ThemeToggle } from './theme-toggle';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-transparent bg-white/80 px-6 py-5 backdrop-blur-xl transition dark:border-white/10 dark:bg-luxe-ebony/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.5em] text-luxe-ash dark:text-luxe-ash/80">ICUNi Scholarships</p>
          <h1 className="font-serif text-2xl text-luxe-ebony dark:text-luxe-ivory">Global Funding Atelier</h1>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
