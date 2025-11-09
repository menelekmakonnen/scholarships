'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/guides', label: 'Guides' }
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-transparent bg-white/80 px-6 py-5 backdrop-blur-xl transition dark:border-white/10 dark:bg-luxe-ebony/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="space-y-1 transition hover:opacity-80">
          <p className="text-xs uppercase tracking-[0.5em] text-luxe-ash dark:text-luxe-ash/80">ICUNi Scholarships</p>
          <h1 className="font-serif text-xl sm:text-2xl text-luxe-ebony dark:text-luxe-ivory">Global Funding Atelier</h1>
        </Link>
        <div className="flex flex-col-reverse items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
          <nav aria-label="Primary" className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs uppercase tracking-[0.35em] text-luxe-ash dark:text-luxe-ash/70">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full border px-4 py-2 transition ${
                    active
                      ? 'border-luxe-gold/80 bg-gradient-to-r from-luxe-gold/30 to-transparent text-luxe-ebony dark:text-luxe-ivory'
                      : 'border-black/10 bg-white/70 text-luxe-ash hover:border-luxe-gold/50 hover:text-luxe-gold dark:border-white/10 dark:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
