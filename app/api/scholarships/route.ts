import { NextResponse } from 'next/server';
import { loadScholarships } from '@/lib/catalog';

export async function GET() {
  try {
    const scholarships = await loadScholarships();
    return NextResponse.json({ scholarships });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Unable to load scholarships' }, { status: 500 });
  }
}
