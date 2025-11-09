import type { Metadata } from 'next';
import { Suspense } from 'react';
import { loadScholarships } from '@/lib/catalog';
import { FeaturedHero } from '@/components/featured-hero';
import { ScholarshipGrid } from '@/components/scholarship-grid';
import { ScholarshipHighlights } from '@/components/scholarship-highlights';
import type { ScholarshipPreview } from '@/lib/types';
import { enrichScholarshipPreview } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'Global Scholarships for International Students | ICUNi Atlas',
  description:
    'Discover a curated feed of fully funded Masters, PhD, MBA, and fellowship scholarships with live imagery, deadline countdowns, and intuitive filters.'
};

function pickFeaturedSet(scholarships: ScholarshipPreview[], count = 3): ScholarshipPreview[] {
  if (scholarships.length === 0) {
    throw new Error('No scholarships available');
  }
  const shuffled = [...scholarships].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export default async function Page() {
  const scholarships = await loadScholarships();
  const featuredSelection = pickFeaturedSet(scholarships);
  const featured = await Promise.all(featuredSelection.map((entry) => enrichScholarshipPreview(entry)));
  const featuredMap = new Map(featured.map((item) => [item.id, item]));
  const hydratedScholarships = scholarships.map((entry) => featuredMap.get(entry.id) ?? entry);

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-16 px-5 py-12 sm:px-8 lg:px-10">
      <FeaturedHero scholarships={featured} />
      <ScholarshipHighlights scholarships={hydratedScholarships} />
      <Suspense fallback={<div className="text-luxe-ash">Loading scholarships…</div>}>
        <ScholarshipGrid scholarships={hydratedScholarships} />
      </Suspense>
    </main>
  );
}
