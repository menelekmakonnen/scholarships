import { NextResponse } from 'next/server';
import { getScholarships } from '@/lib/sheets';
import { resolveScholarshipMetadata } from '@/lib/metadata';

export async function GET(_: Request, context: { params: { id: string } }) {
  try {
    const scholarships = await getScholarships();
    const scholarship = scholarships.find((item) => item.id === context.params.id);
    if (!scholarship) {
      return NextResponse.json({ message: 'Scholarship not found' }, { status: 404 });
    }
    const detailed = await resolveScholarshipMetadata(scholarship);
    return NextResponse.json(detailed);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Unable to load scholarship' }, { status: 500 });
  }
}
