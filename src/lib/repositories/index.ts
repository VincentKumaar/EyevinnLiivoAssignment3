import { getDbPool, isPostgresConfigured } from '@/lib/db';
import { BriefingRepository } from '@/lib/repositories/briefing-repository';
import { SubscriberRepository } from '@/lib/repositories/subscriber-repository';
import { FileBriefingRepository } from '@/lib/repositories/file-briefing-repository';
import { FileSubscriberRepository } from '@/lib/repositories/file-subscriber-repository';
import { PostgresBriefingRepository } from '@/lib/repositories/postgres-briefing-repository';
import { PostgresSubscriberRepository } from '@/lib/repositories/postgres-subscriber-repository';

let briefingRepository: BriefingRepository | undefined;
let subscriberRepository: SubscriberRepository | undefined;

export function getBriefingRepository(): BriefingRepository {
  if (briefingRepository) {
    return briefingRepository;
  }

  if (isPostgresConfigured()) {
    const pool = getDbPool();
    if (pool) {
      briefingRepository = new PostgresBriefingRepository(pool);
      return briefingRepository;
    }
  }

  briefingRepository = new FileBriefingRepository();
  return briefingRepository;
}

export function getSubscriberRepository(): SubscriberRepository {
  if (subscriberRepository) {
    return subscriberRepository;
  }

  if (isPostgresConfigured()) {
    const pool = getDbPool();
    if (pool) {
      subscriberRepository = new PostgresSubscriberRepository(pool);
      return subscriberRepository;
    }
  }

  subscriberRepository = new FileSubscriberRepository();
  return subscriberRepository;
}
