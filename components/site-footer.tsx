export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-black/10 bg-white/70 px-6 py-10 text-sm text-luxe-ebony backdrop-blur-lg dark:border-white/10 dark:bg-white/5 dark:text-luxe-ash">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="font-serif text-2xl text-luxe-ebony dark:text-luxe-ivory">ICUNi Scholarships Atlas</p>
          <p className="max-w-xl text-xs uppercase tracking-[0.3em] text-luxe-ash dark:text-luxe-ash/80">
            Curated pathways for scholars ready to change the world.
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 text-xs uppercase tracking-[0.25em] text-luxe-ash dark:text-luxe-ash/80 sm:flex-row sm:items-center sm:gap-6">
          <span>© {year} ICUNi</span>
          <span className="hidden h-3 w-px bg-luxe-ash/30 sm:inline" aria-hidden="true" />
          <a
            href="https://icuni.org"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-black/10 bg-white/80 px-4 py-2 text-[11px] font-semibold tracking-[0.35em] text-luxe-ebony transition hover:border-luxe-gold/50 hover:text-luxe-gold dark:border-white/10 dark:bg-white/10 dark:text-luxe-ivory"
          >
            Explore ICUNi
          </a>
        </div>
      </div>
    </footer>
  );
}
