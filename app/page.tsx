import { Suspense } from 'react';
import { loadScholarships } from '@/lib/catalog';
import { FeaturedHero } from '@/components/featured-hero';
import { ScholarshipGrid } from '@/components/scholarship-grid';
import type { ScholarshipPreview } from '@/lib/types';

function pickFeaturedSet(scholarships: ScholarshipPreview[], count = 3): ScholarshipPreview[] {
  if (scholarships.length === 0) {
    throw new Error('No scholarships available');
  }
  const shuffled = [...scholarships].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export default async function Page() {
  const scholarships = await loadScholarships();
  const featured = pickFeaturedSet(scholarships);

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-16 px-5 py-12 sm:px-8 lg:px-10">
      <FeaturedHero scholarships={featured} />
      <Suspense fallback={<div className="text-luxe-ash">Loading scholarships…</div>}>
        <ScholarshipGrid scholarships={scholarships} />
      </Suspense>
    </main>
  );
}
