import { NextResponse } from 'next/server';
import { getPublicStats } from '@/services/stats/stats.service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = await getPublicStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load statistics' },
      { status: 500 }
    );
  }
}
