import { getSubscriberRepository } from '@/lib/repositories';
import { FileSubscriberRepository } from '@/lib/repositories/file-subscriber-repository';
import { sendToContactService } from '@/lib/contact-service';
import { Industry, Subscriber } from '@/lib/types';

export async function subscribeToBriefing(email: string, industry: Industry): Promise<boolean> {
  const subscriber: Subscriber = {
    email: email.trim().toLowerCase(),
    industry,
    createdAt: new Date().toISOString()
  };

  const primaryRepository = getSubscriberRepository();

  try {
    await primaryRepository.save(subscriber);
  } catch {
    const fallbackRepository = new FileSubscriberRepository();
    await fallbackRepository.save(subscriber);
  }

  try {
    return await sendToContactService(subscriber);
  } catch {
    return false;
  }
}
