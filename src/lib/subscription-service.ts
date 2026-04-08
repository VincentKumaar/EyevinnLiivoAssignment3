import { getSubscriberRepository } from '@/lib/repositories';
import { sendToContactService } from '@/lib/contact-service';
import { Industry, Subscriber } from '@/lib/types';

export async function subscribeToBriefing(email: string, industry: Industry): Promise<boolean> {
  const subscriber: Subscriber = {
    email: email.trim().toLowerCase(),
    industry,
    createdAt: new Date().toISOString()
  };

  const repository = getSubscriberRepository();
  await repository.save(subscriber);

  try {
    return await sendToContactService(subscriber);
  } catch {
    return false;
  }
}
