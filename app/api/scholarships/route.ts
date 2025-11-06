import { NextResponse } from 'next/server';
import { getScholarships } from '@/lib/sheets';
import { enrichScholarshipPreview } from '@/lib/metadata';

async function withConcurrency<T, R>(items: T[], limit: number, iterator: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = [];
  const executing: Promise<void>[] = [];

  for (const item of items) {
    const task = (async () => {
      const result = await iterator(item);
      results.push(result);
    })();
    executing.push(task.then(() => {
      executing.splice(executing.indexOf(task), 1);
    }));
    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
  return results;
}

export async function GET() {
  try {
    const scholarships = await getScholarships();
    const enriched = await withConcurrency(scholarships, 4, async (scholarship) =>
      enrichScholarshipPreview(scholarship)
    );
    enriched.sort((a, b) => a.name.localeCompare(b.name));
    return NextResponse.json({ scholarships: enriched });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Unable to load scholarships' }, { status: 500 });
  }
}
