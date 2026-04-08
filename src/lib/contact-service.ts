import { Subscriber } from '@/lib/types';

export async function sendToContactService(subscriber: Subscriber): Promise<boolean> {
  const endpoint = process.env.CONTACT_FORM_ENDPOINT;

  if (!endpoint) {
    return false;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (process.env.CONTACT_FORM_API_KEY) {
    headers['x-api-key'] = process.env.CONTACT_FORM_API_KEY;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      email: subscriber.email,
      industry: subscriber.industry,
      source: 'cyber-briefing-se',
      subscribedAt: subscriber.createdAt
    }),
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`Contact service request failed: ${response.status}`);
  }

  return true;
}
