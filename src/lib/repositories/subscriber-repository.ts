import { Subscriber } from '@/lib/types';

export interface SubscriberRepository {
  save(subscriber: Subscriber): Promise<void>;
}
