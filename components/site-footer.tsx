import Link from 'next/link';

const QUICK_LINKS = [
  { label: 'PhD Scholarships', href: '/scholarships/level/phd' },
  { label: 'Masters Scholarships', href: '/scholarships/level/masters' },
  { label: 'MBA Funding', href: '/scholarships/level/mba' },
  { label: 'Study in the USA', href: '/scholarships/country/united-states' },
  { label: 'Fully Funded Awards', href: '/scholarships/funding/fully-funded' }
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-black/10 bg-white/70 px-6 py-12 text-sm text-luxe-ebony backdrop-blur-lg dark:border-white/10 dark:bg-white/5 dark:text-luxe-ash">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.3fr_1fr]">
        <div className="space-y-4">
          <p className="font-serif text-2xl text-luxe-ebony dark:text-luxe-ivory">ICUNi Scholarships Atlas</p>
          <p className="max-w-xl text-xs uppercase tracking-[0.3em] text-luxe-ash dark:text-luxe-ash/80">
            Curated pathways for scholars ready to change the world. We analyse opportunities across continents, spotlight emerging funding, and distil the essentials so you can focus on your application.
          </p>
          <div className="flex items-center gap-6 text-xs uppercase tracking-[0.25em] text-luxe-ash dark:text-luxe-ash/80">
            <span>© {year} ICUNi</span>
            <span className="hidden h-3 w-px bg-luxe-ash/30 md:inline" aria-hidden="true" />
            <span className="rounded-full border border-dashed border-luxe-gold/30 px-4 py-2 text-[11px] font-semibold tracking-[0.35em] text-luxe-ash/80 dark:text-luxe-ash/70">
              Crafted for Scholars
            </span>
          </div>
        </div>
        <div className="grid gap-4 text-xs uppercase tracking-[0.25em] text-luxe-ash dark:text-luxe-ash/80 sm:grid-cols-2">
          <div className="space-y-3">
            <p className="font-semibold text-luxe-ebony dark:text-luxe-ivory">Quick Links</p>
            <ul className="space-y-2">
              {QUICK_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-2 text-[11px] transition hover:border-luxe-gold/50 hover:text-luxe-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <p className="font-semibold text-luxe-ebony dark:text-luxe-ivory">Stay Inspired</p>
            <p className="text-[11px] leading-relaxed text-luxe-ash dark:text-luxe-ash/75">
              A monthly digest with new scholarships and application tips is on the way. Add us to your bookmarks and check back soon.
            </p>
            <div className="inline-flex items-center justify-center rounded-full border border-dashed border-luxe-gold/40 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-luxe-ash/80 dark:text-luxe-ash">
              Join the List · Coming Soon
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
