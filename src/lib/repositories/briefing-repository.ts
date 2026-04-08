import { DailyBriefing } from '@/lib/types';

export interface BriefingRepository {
  getByDate(date: string): Promise<DailyBriefing | null>;
  list(limit?: number): Promise<DailyBriefing[]>;
  save(briefing: DailyBriefing): Promise<void>;
}
