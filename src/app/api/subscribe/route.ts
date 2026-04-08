import { NextResponse } from 'next/server';
import { subscribeToBriefing } from '@/lib/subscription-service';
import { INDUSTRIES } from '@/lib/types';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const payload = (await request.json()) as { email?: string; industry?: string };

  if (!payload.email || !emailPattern.test(payload.email)) {
    return NextResponse.json({ message: 'Ange en giltig e-postadress.' }, { status: 400 });
  }

  if (!payload.industry || !INDUSTRIES.includes(payload.industry as (typeof INDUSTRIES)[number])) {
    return NextResponse.json({ message: 'Välj en giltig bransch.' }, { status: 400 });
  }

  const forwarded = await subscribeToBriefing(payload.email, payload.industry as (typeof INDUSTRIES)[number]);

  return NextResponse.json({
    ok: true,
    message: forwarded
      ? 'Tack! Du är registrerad och kommer få dagliga utskick.'
      : 'Tack! Du är registrerad. Kontaktintegration kan aktiveras senare.'
  });
}
