import { unstable_cache } from 'next/cache';
import { getScholarships } from './sheets';
import type { ScholarshipPreview } from './types';

async function buildScholarshipCatalog(): Promise<ScholarshipPreview[]> {
  const scholarships = await getScholarships();
  return scholarships;
}

const cachedCatalog = unstable_cache(buildScholarshipCatalog, ['scholarship-catalog'], {
  revalidate: 60 * 30
});

export async function loadScholarships(): Promise<ScholarshipPreview[]> {
  return cachedCatalog();
}

export async function loadScholarshipsFresh(): Promise<ScholarshipPreview[]> {
  return buildScholarshipCatalog();
}
