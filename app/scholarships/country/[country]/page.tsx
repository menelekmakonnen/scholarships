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

function resolveCountryLabelFromDataset(
  scholarships: Awaited<ReturnType<typeof loadScholarships>>,
  slug: string
): string | null {
  const target = slugify(decodeURIComponent(slug));
  for (const entry of scholarships) {
    for (const country of entry.countries) {
      if (slugify(country) === target) {
        return country;
      }
    }
  }
  return null;
}

interface CountryPageProps {
  params: { country: string };
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const scholarships = await loadScholarships();
  const label = resolveCountryLabelFromDataset(scholarships, params.country);
  if (!label) {
    return { title: 'Scholarships by Country', description: 'Browse scholarships curated by destination.' };
  }
  return {
    title: `${label} Scholarships | ICUNi`,
    description: `Discover scholarships available in ${label} with coverage, eligibility, and deadlines verified by ICUNi.`
  };
}

export default async function CountryPage({ params }: CountryPageProps) {
  const scholarships = await loadScholarships();
  const label = resolveCountryLabelFromDataset(scholarships, params.country);
  if (!label) {
    notFound();
  }
  const matching = scholarships.filter((entry) => entry.countries.some((country) => country === label));
  const description = matching.length
    ? `${matching.length.toLocaleString()} curated opportunities welcoming scholars to ${label}. Adjust filters to include neighbouring destinations.`
    : `No active scholarships currently feature ${label}. Clear the filters to review the full atlas.`;

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-16 px-5 py-12 sm:px-8 lg:px-10">
      <ScholarshipGrid
        scholarships={scholarships}
        heading={`Scholarships in ${label}`}
        description={description}
        initialFilters={{ countries: [label] }}
      />
    </main>
  );
}
