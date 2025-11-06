import { Suspense } from 'react';
import { loadScholarships } from '@/lib/catalog';
import { FeaturedHero } from '@/components/featured-hero';
import { ScholarshipGrid } from '@/components/scholarship-grid';
import type { ScholarshipPreview } from '@/lib/types';

function pickFeatured(scholarships: ScholarshipPreview[]): ScholarshipPreview {
  if (scholarships.length === 0) {
    throw new Error('No scholarships available');
  }
  const randomIndex = Math.floor(Math.random() * scholarships.length);
  return scholarships[randomIndex];
}

export default async function Page() {
  const scholarships = await loadScholarships();
  const featured = pickFeatured(scholarships);

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-14 px-5 py-12 sm:px-8 lg:px-10">
      <FeaturedHero scholarship={featured} />
      <Suspense fallback={<div className="text-luxe-ash">Loading scholarships…</div>}>
        <ScholarshipGrid scholarships={scholarships} />
      </Suspense>
    </main>
  );
}
