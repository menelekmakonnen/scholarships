import type { Metadata } from 'next';
import { getScholarships } from '@/lib/sheets';

export const metadata: Metadata = {
  title: 'About ICUNi Scholarships Atlas',
  description:
    'Learn about ICUNi\'s mission to curate global scholarships, how we analyse opportunities, and how to navigate the atlas to find your perfect award.'
};

export default async function AboutPage() {
  const scholarships = await getScholarships();
  const activeCount = scholarships.filter((entry) => !entry.isExpired).length;
  const countryCount = new Set(
    scholarships.flatMap((entry) => (entry.countries.length ? entry.countries : ['Global']))
  ).size;

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-12 px-5 py-16 sm:px-8 lg:px-10">
      <header className="space-y-4 text-center">
        <p className="text-xs uppercase tracking-[0.5em] text-luxe-ash dark:text-luxe-ash/70">Our Story</p>
        <h1 className="font-serif text-4xl text-luxe-ebony dark:text-luxe-ivory sm:text-5xl">Inside the ICUNi Scholarships Atlas</h1>
        <p className="mx-auto max-w-2xl text-base text-luxe-ash dark:text-luxe-ash/80">
          ICUNi curates a living atlas of scholarships so that ambitious scholars can focus on crafting winning applications. We combine meticulous research, first-hand experiences, and technology to keep this guide authoritative, current, and inspiring.
        </p>
      </header>
      <section className="grid gap-6 rounded-3xl border border-black/10 bg-white/85 p-10 text-left shadow-[0_18px_45px_-32px_rgba(15,20,25,0.35)] dark:border-white/10 dark:bg-white/5">
        <h2 className="font-serif text-2xl text-luxe-ebony dark:text-luxe-ivory">What We Do</h2>
        <ul className="space-y-3 text-sm leading-relaxed text-luxe-ash dark:text-luxe-ash/75">
          <li>
            <strong className="text-luxe-ebony dark:text-luxe-ivory">Curate global opportunities:</strong> our specialists review hundreds of programmes every month, prioritising awards with generous funding, clear eligibility, and reputable hosts.
          </li>
          <li>
            <strong className="text-luxe-ebony dark:text-luxe-ivory">Surface actionable insights:</strong> every listing highlights coverage, eligibility levels, and crisp deadlines so you can decide quickly whether an award fits your trajectory.
          </li>
          <li>
            <strong className="text-luxe-ebony dark:text-luxe-ivory">Guide your next step:</strong> we enrich each scholarship with imagery, summaries, and direct links so you can dive deeper without leaving the atlas.
          </li>
        </ul>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-luxe-gold/40 bg-gradient-to-br from-luxe-gold/20 to-transparent p-6 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-luxe-ash dark:text-luxe-ash/70">Active Scholarships</p>
            <p className="font-serif text-3xl text-luxe-ebony dark:text-luxe-ivory">{activeCount.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl border border-luxe-emerald/40 bg-gradient-to-br from-luxe-emerald/20 to-transparent p-6 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-luxe-ash dark:text-luxe-ash/70">Countries Represented</p>
            <p className="font-serif text-3xl text-luxe-ebony dark:text-luxe-ivory">{countryCount.toLocaleString()}</p>
          </div>
        </div>
      </section>
      <section className="grid gap-6 md:grid-cols-2">
        <article className="space-y-4 rounded-3xl border border-black/10 bg-white/80 p-8 text-left dark:border-white/10 dark:bg-white/5">
          <h3 className="font-serif text-2xl text-luxe-ebony dark:text-luxe-ivory">How to Navigate the Atlas</h3>
          <ol className="space-y-3 text-sm leading-relaxed text-luxe-ash dark:text-luxe-ash/75">
            <li>
              Use the <strong>Filter</strong> button to focus on the countries, study levels, or funding types that match your goals. Filters slide in on the right and preserve your selections as you browse.
            </li>
            <li>
              Choose a sort option to review opportunities by deadline urgency, alphabetical order, or geography. The atlas instantly updates without reloading.
            </li>
            <li>
              Tap any scholarship card to open an immersive profile with imagery, deadline countdowns, summaries, and a prominent link to the official site.
            </li>
          </ol>
        </article>
        <article className="space-y-4 rounded-3xl border border-black/10 bg-white/80 p-8 text-left dark:border-white/10 dark:bg-white/5">
          <h3 className="font-serif text-2xl text-luxe-ebony dark:text-luxe-ivory">Our Commitment to Accuracy</h3>
          <p className="text-sm leading-relaxed text-luxe-ash dark:text-luxe-ash/75">
            We refresh metadata throughout the day, monitor deadlines in real time, and spotlight only reputable programmes. If you spot an update we should capture, reach us at{' '}
            <a href="mailto:scholarships@icuni.org" className="text-luxe-gold underline">
              scholarships@icuni.org
            </a>
            .
          </p>
          <p className="text-sm leading-relaxed text-luxe-ash dark:text-luxe-ash/75">
            Curious about strategies for competitive scholarships? Our long-form guides on essays, recommendations, and interviews are being finalised and will launch soon.
          </p>
          <div className="inline-flex items-center justify-center rounded-full border border-dashed border-luxe-gold/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-luxe-ash/80 dark:text-luxe-ash">
            Guides Coming Soon
          </div>
        </article>
      </section>
    </main>
  );
}
