import { Subscriber } from '@/lib/types';
import { SubscriberRepository } from '@/lib/repositories/subscriber-repository';
import { readJsonFile, writeJsonFile } from '@/lib/repositories/file-store';

type SubscriberFileShape = {
  subscribers: Subscriber[];
};

const FILE_NAME = 'subscribers.json';
const FALLBACK_DATA: SubscriberFileShape = { subscribers: [] };

export class FileSubscriberRepository implements SubscriberRepository {
  async save(subscriber: Subscriber): Promise<void> {
    const data = await readJsonFile(FILE_NAME, FALLBACK_DATA);
    const withoutEmail = data.subscribers.filter(
      (item) => item.email.toLowerCase() !== subscriber.email.toLowerCase()
    );

    withoutEmail.push(subscriber);

    const sorted = withoutEmail.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    await writeJsonFile(FILE_NAME, { subscribers: sorted });
  }
}
