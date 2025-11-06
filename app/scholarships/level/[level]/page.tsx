import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { loadScholarships } from '@/lib/catalog';
import { ScholarshipGrid } from '@/components/scholarship-grid';

const LEVEL_SLUGS: Record<string, string> = {
  undergraduate: 'Undergraduate',
  undergrad: 'Undergraduate',
  bachelors: 'Undergraduate',
  masters: 'Masters',
  master: 'Masters',
  postgraduate: 'Postgraduate',
  postgrad: 'Postgraduate',
  phd: 'PhD',
  doctoral: 'PhD',
  doctorate: 'PhD',
  postdoctoral: 'Postdoctoral',
  postdoc: 'Postdoctoral',
  research: 'Research',
  fellowship: 'Fellowship',
  professional: 'Professional',
  mba: 'MBA'
};

interface LevelPageProps {
  params: { level: string };
}

function getLevelLabel(slug: string): string | null {
  return LEVEL_SLUGS[slug.toLowerCase()] ?? null;
}

export async function generateMetadata({ params }: LevelPageProps): Promise<Metadata> {
  const label = getLevelLabel(params.level);
  if (!label) {
    return { title: 'Scholarships', description: 'Scholarship listings by academic level.' };
  }
  return {
    title: `${label} Scholarships | ICUNi`,
    description: `Explore active ${label.toLowerCase()} scholarships curated by ICUNi with clear funding insights and deadlines.`
  };
}

export default async function LevelPage({ params }: LevelPageProps) {
  const label = getLevelLabel(params.level);
  if (!label) {
    notFound();
  }

  const scholarships = await loadScholarships();
  const matching = scholarships.filter((entry) => entry.levelTags.includes(label));
  const description = matching.length
    ? `${matching.length.toLocaleString()} hand-picked ${label.toLowerCase()} scholarships. Adjust filters to widen your search or compare other levels.`
    : `No active ${label.toLowerCase()} scholarships at the moment. Clear filters to explore the full atlas.`;

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-16 px-5 py-12 sm:px-8 lg:px-10">
      <ScholarshipGrid
        scholarships={scholarships}
        heading={`${label} Scholarships`}
        description={description}
        initialFilters={{ levels: [label] }}
      />
    </main>
  );
}
