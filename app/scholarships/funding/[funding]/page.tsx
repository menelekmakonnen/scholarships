import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { loadScholarships } from '@/lib/catalog';
import { ScholarshipGrid } from '@/components/scholarship-grid';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function resolveCoverageLabel(
  scholarships: Awaited<ReturnType<typeof loadScholarships>>,
  slug: string
): string | null {
  const target = slugify(decodeURIComponent(slug));
  for (const entry of scholarships) {
    for (const coverage of entry.coverage) {
      if (slugify(coverage) === target) {
        return coverage;
      }
    }
  }
  return null;
}

interface FundingPageProps {
  params: { funding: string };
}

export async function generateMetadata({ params }: FundingPageProps): Promise<Metadata> {
  const scholarships = await loadScholarships();
  const label = resolveCoverageLabel(scholarships, params.funding);
  if (!label) {
    return { title: 'Scholarships by Funding Type', description: 'Review scholarships grouped by coverage and funding benefits.' };
  }
  return {
    title: `${label} Scholarships | ICUNi`,
    description: `Browse scholarships that include ${label.toLowerCase()} so you can assess the generosity of each award at a glance.`
  };
}

export default async function FundingPage({ params }: FundingPageProps) {
  const scholarships = await loadScholarships();
  const label = resolveCoverageLabel(scholarships, params.funding);
  if (!label) {
    notFound();
  }
  const matching = scholarships.filter((entry) => entry.coverage.some((item) => item === label));
  const description = matching.length
    ? `${matching.length.toLocaleString()} scholarships offer ${label.toLowerCase()}. Dial in additional filters to craft your personalised shortlist.`
    : `No scholarships currently list ${label.toLowerCase()} as a benefit. Clear filters to keep exploring.`;

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-16 px-5 py-12 sm:px-8 lg:px-10">
      <ScholarshipGrid
        scholarships={scholarships}
        heading={`${label} Coverage Scholarships`}
        description={description}
        initialFilters={{ coverage: [label] }}
      />
    </main>
  );
}
