import type { Metadata } from 'next';

const GUIDES = [
  {
    slug: 'mext-scholarship-guide',
    title: 'How to Apply for the MEXT Scholarship',
    summary:
      'Our deep-dive blueprint is in production. Expect tailored timelines, essay prompts, and interview prep tips soon.'
  },
  {
    slug: 'chevening-essay-playbook',
    title: 'Writing Standout Chevening Scholarship Essays',
    summary:
      'We are refining case studies and storytelling frameworks so you can craft unforgettable submissions. Coming soon.'
  },
  {
    slug: 'fully-funded-mba-roadmap',
    title: 'Your Roadmap to Fully Funded MBA Scholarships',
    summary:
      'Comprehensive funding matrices and networking strategies are on the way. Stay tuned for the full release.'
  }
];

export const metadata: Metadata = {
  title: 'Scholarship Guides | ICUNi',
  description:
    'Our long-form scholarship guides are currently in production. Sign up to be notified when deep-dive strategy playbooks launch.'
};

export default function GuidesPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-12 px-5 py-16 sm:px-8 lg:px-10">
      <header className="space-y-4 text-center">
        <p className="text-xs uppercase tracking-[0.5em] text-luxe-ash dark:text-luxe-ash/70">Guides</p>
        <h1 className="font-serif text-4xl text-luxe-ebony dark:text-luxe-ivory sm:text-5xl">Scholarship Strategy Library</h1>
        <p className="mx-auto max-w-2xl text-base text-luxe-ash dark:text-luxe-ash/80">
          Our editorial team is preparing immersive scholarship playbooks. Each feature will outline requirements, timelines, insider tips, and winning examples—check back soon.
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
            <div className="mt-auto inline-flex items-center justify-center rounded-full border border-dashed border-luxe-gold/40 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-luxe-ash/80 dark:text-luxe-ash">
              Coming Soon
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
