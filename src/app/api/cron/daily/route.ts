import { NextResponse } from 'next/server';
import { getOrCreateBriefingByDate } from '@/lib/briefing-service';
import { getStockholmDateString } from '@/lib/date';

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    return true;
  }

  const provided = request.headers.get('x-cron-secret');
  return provided === secret;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const date = getStockholmDateString();
  const briefing = await getOrCreateBriefingByDate(date);

  return NextResponse.json({
    ok: true,
    date,
    id: briefing.id
  });
}
