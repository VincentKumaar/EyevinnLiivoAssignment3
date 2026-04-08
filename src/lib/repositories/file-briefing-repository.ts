import { DailyBriefing } from '@/lib/types';
import { BriefingRepository } from '@/lib/repositories/briefing-repository';
import { readJsonFile, writeJsonFile } from '@/lib/repositories/file-store';

type BriefingFileShape = {
  briefings: DailyBriefing[];
};

const FILE_NAME = 'briefings.json';
const FALLBACK_DATA: BriefingFileShape = { briefings: [] };

export class FileBriefingRepository implements BriefingRepository {
  async getByDate(date: string): Promise<DailyBriefing | null> {
    const data = await readJsonFile(FILE_NAME, FALLBACK_DATA);
    const found = data.briefings.find((item) => item.date === date);
    return found ?? null;
  }

  async list(limit = 30): Promise<DailyBriefing[]> {
    const data = await readJsonFile(FILE_NAME, FALLBACK_DATA);
    return [...data.briefings]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, Math.max(1, limit));
  }

  async save(briefing: DailyBriefing): Promise<void> {
    const data = await readJsonFile(FILE_NAME, FALLBACK_DATA);
    const withoutDate = data.briefings.filter((item) => item.date !== briefing.date);
    withoutDate.push(briefing);

    const sorted = withoutDate.sort((a, b) => b.date.localeCompare(a.date));
    await writeJsonFile(FILE_NAME, { briefings: sorted });
  }
}
