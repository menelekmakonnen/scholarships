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

function resolveFundingTypeLabel(
  scholarships: Awaited<ReturnType<typeof loadScholarships>>,
  slug: string
): string | null {
  const target = slugify(decodeURIComponent(slug));
  for (const entry of scholarships) {
    if (entry.fundingType && slugify(entry.fundingType) === target) {
      return entry.fundingType;
    }
  }
  return null;
}

interface FundingPageProps {
  params: { funding: string };
}

export async function generateMetadata({ params }: FundingPageProps): Promise<Metadata> {
  const scholarships = await loadScholarships();
  const label = resolveFundingTypeLabel(scholarships, params.funding);
  if (!label) {
    return { title: 'Scholarships by Funding Type', description: 'Review scholarships grouped by type of funding.' };
  }
  return {
    title: `${label} Scholarships | ICUNi`,
    description: `Browse ${label.toLowerCase()} scholarships to find opportunities that match your funding needs.`
  };
}

export default async function FundingPage({ params }: FundingPageProps) {
  const scholarships = await loadScholarships();
  const label = resolveFundingTypeLabel(scholarships, params.funding);
  if (!label) {
    notFound();
  }
  const matching = scholarships.filter((entry) => entry.fundingType === label);
  const description = matching.length
    ? `${matching.length.toLocaleString()} scholarships are classified as ${label.toLowerCase()}. Dial in additional filters to craft your personalised shortlist.`
    : `No scholarships currently classified as ${label.toLowerCase()}. Clear filters to keep exploring.`;

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-16 px-5 py-12 sm:px-8 lg:px-10">
      <ScholarshipGrid
        scholarships={scholarships}
        heading={`${label} Scholarships`}
        description={description}
        initialFilters={{ fundingTypes: [label] }}
      />
    </main>
  );
}
