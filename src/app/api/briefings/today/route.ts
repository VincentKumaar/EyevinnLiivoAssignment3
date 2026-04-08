import { NextResponse } from 'next/server';
import { getTodayBriefing } from '@/lib/briefing-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  const briefing = await getTodayBriefing();
  return NextResponse.json(briefing, {
    headers: {
      'Cache-Control': 'no-store'
    }
  });
}
