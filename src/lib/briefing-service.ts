import { generateDailyBriefing } from '@/lib/briefing-generator';
import { getCacheClient } from '@/lib/cache';
import { getStockholmDateString, secondsUntilNextStockholmMidnight } from '@/lib/date';
import { getBriefingRepository } from '@/lib/repositories';
import { FileBriefingRepository } from '@/lib/repositories/file-briefing-repository';
import { DailyBriefing } from '@/lib/types';

function getCacheKey(date: string): string {
  return `daily-briefing:${date}`;
}

export async function getOrCreateBriefingByDate(date: string): Promise<DailyBriefing> {
  const cacheKey = getCacheKey(date);
  let cached: string | null = null;

  try {
    const cache = await getCacheClient();
    cached = await cache.get(cacheKey);
  } catch {
    cached = null;
  }

  if (cached !== null) {
    return JSON.parse(cached) as DailyBriefing;
  }

  const primaryRepository = getBriefingRepository();
  let fromStore: DailyBriefing | null = null;
  let activeRepository = primaryRepository;

  try {
    fromStore = await primaryRepository.getByDate(date);
  } catch {
    activeRepository = new FileBriefingRepository();
    fromStore = await activeRepository.getByDate(date);
  }

  if (fromStore) {
    try {
      const cache = await getCacheClient();
      await cache.set(cacheKey, JSON.stringify(fromStore), secondsUntilNextStockholmMidnight());
    } catch {
      // no-op: cache issues should never block briefing delivery
    }

    return fromStore;
  }

  const generated = generateDailyBriefing(date);

  try {
    await activeRepository.save(generated);
  } catch {
    const fallbackRepository = new FileBriefingRepository();
    await fallbackRepository.save(generated);
  }

  try {
    const cache = await getCacheClient();
    await cache.set(cacheKey, JSON.stringify(generated), secondsUntilNextStockholmMidnight());
  } catch {
    // no-op: cache issues should never block briefing delivery
  }

  return generated;
}

export async function getTodayBriefing(): Promise<DailyBriefing> {
  return getOrCreateBriefingByDate(getStockholmDateString());
}

export async function listBriefings(limit = 30): Promise<DailyBriefing[]> {
  const primaryRepository = getBriefingRepository();

  try {
    return await primaryRepository.list(limit);
  } catch {
    const fallbackRepository = new FileBriefingRepository();
    return fallbackRepository.list(limit);
  }
}
