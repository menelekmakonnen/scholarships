import type { Metadata } from 'next';
import Link from 'next/link';

const GUIDES = [
  {
    slug: 'mext-scholarship-guide',
    title: 'How to Apply for the MEXT Scholarship',
    summary:
      'Step-by-step advice for compiling a winning research proposal, preparing for embassy interviews, and aligning with Japan\'s development priorities.'
  },
  {
    slug: 'chevening-essay-playbook',
    title: 'Writing Standout Chevening Scholarship Essays',
    summary:
      'Strategies for showcasing leadership impact, building a coherent global network story, and articulating a compelling return plan.'
  },
  {
    slug: 'fully-funded-mba-roadmap',
    title: 'Your Roadmap to Fully Funded MBA Scholarships',
    summary:
      'Position your professional achievements, craft a memorable GMAT waiver request, and target business schools with generous fellowships.'
  }
];

export const metadata: Metadata = {
  title: 'Scholarship Guides | ICUNi',
  description:
    'Dive into expert-written scholarship guides covering MEXT, Chevening, and fully funded MBAs. Learn how to craft essays, secure recommendations, and ace interviews.'
};

export default function GuidesPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-12 px-5 py-16 sm:px-8 lg:px-10">
      <header className="space-y-4 text-center">
        <p className="text-xs uppercase tracking-[0.5em] text-luxe-ash dark:text-luxe-ash/70">Guides</p>
        <h1 className="font-serif text-4xl text-luxe-ebony dark:text-luxe-ivory sm:text-5xl">Scholarship Strategy Library</h1>
        <p className="mx-auto max-w-2xl text-base text-luxe-ash dark:text-luxe-ash/80">
          Deepen your expertise with editorial features created by advisors and alumni. Each guide distils years of experience into actionable insights you can apply immediately.
        </p>
      </header>
      <section className="grid gap-6 md:grid-cols-3">
        {GUIDES.map((guide) => (
          <article
            key={guide.slug}
            className="flex flex-col gap-4 rounded-3xl border border-black/10 bg-white/85 p-6 text-left shadow-[0_18px_45px_-32px_rgba(15,20,25,0.35)] transition hover:-translate-y-1 hover:shadow-[0_28px_70px_-34px_rgba(212,175,55,0.55)] dark:border-white/10 dark:bg-white/5"
          >
            <h2 className="font-serif text-2xl text-luxe-ebony dark:text-luxe-ivory">{guide.title}</h2>
            <p className="text-sm leading-relaxed text-luxe-ash dark:text-luxe-ash/75">{guide.summary}</p>
            <Link
              href={`mailto:scholarships@icuni.org?subject=${encodeURIComponent(guide.title)}%20Insights`}
              className="mt-auto inline-flex items-center justify-center rounded-full border border-luxe-gold/40 bg-gradient-to-r from-luxe-gold/25 to-transparent px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-luxe-ebony transition hover:border-luxe-gold/70 hover:text-luxe-gold dark:text-luxe-ivory"
            >
              Request Full Guide
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
