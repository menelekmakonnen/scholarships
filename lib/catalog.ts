import { getScholarships } from './sheets';
import { enrichScholarshipPreview } from './metadata';
import type { ScholarshipPreview } from './types';

async function withConcurrency<T, R>(items: T[], limit: number, iterator: (item: T) => Promise<R>): Promise<R[]> {
  const queue = [...items];
  const results: R[] = [];

  async function worker() {
    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) break;
      const result = await iterator(item);
      results.push(result);
    }
  }

  const workers = Array.from({ length: limit }, () => worker());
  await Promise.all(workers);
  return results;
}

export async function loadScholarships(): Promise<ScholarshipPreview[]> {
  const scholarships = await getScholarships();
  const enriched = await withConcurrency(scholarships, 4, (item) => enrichScholarshipPreview(item));
  enriched.sort((a, b) => a.name.localeCompare(b.name));
  return enriched;
}
