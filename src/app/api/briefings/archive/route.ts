import { NextRequest, NextResponse } from 'next/server';
import { listBriefings } from '@/lib/briefing-service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const limitParam = request.nextUrl.searchParams.get('limit');
  const limit = limitParam ? Number(limitParam) : 30;
  const sanitizedLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 365) : 30;

  const archive = await listBriefings(sanitizedLimit);

  return NextResponse.json(archive, {
    headers: {
      'Cache-Control': 'no-store'
    }
  });
}
