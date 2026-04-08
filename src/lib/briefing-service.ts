import { generateDailyBriefing } from '@/lib/briefing-generator';
import { getCacheClient } from '@/lib/cache';
import { getStockholmDateString, secondsUntilNextStockholmMidnight } from '@/lib/date';
import { getBriefingRepository } from '@/lib/repositories';
import { DailyBriefing } from '@/lib/types';

function getCacheKey(date: string): string {
  return `daily-briefing:${date}`;
}

export async function getOrCreateBriefingByDate(date: string): Promise<DailyBriefing> {
  const cache = await getCacheClient();
  const cacheKey = getCacheKey(date);
  const cached = await cache.get(cacheKey);

  if (cached) {
    return JSON.parse(cached) as DailyBriefing;
  }

  const repository = getBriefingRepository();
  const fromStore = await repository.getByDate(date);

  if (fromStore) {
    await cache.set(cacheKey, JSON.stringify(fromStore), secondsUntilNextStockholmMidnight());
    return fromStore;
  }

  const generated = generateDailyBriefing(date);
  await repository.save(generated);
  await cache.set(cacheKey, JSON.stringify(generated), secondsUntilNextStockholmMidnight());

  return generated;
}

export async function getTodayBriefing(): Promise<DailyBriefing> {
  return getOrCreateBriefingByDate(getStockholmDateString());
}

export async function listBriefings(limit = 30): Promise<DailyBriefing[]> {
  const repository = getBriefingRepository();
  return repository.list(limit);
}
