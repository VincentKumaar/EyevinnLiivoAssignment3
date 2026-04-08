'use client';

import { FormEvent, useState } from 'react';
import { INDUSTRIES, Industry } from '@/lib/types';

export function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [industry, setIndustry] = useState<Industry>('finans');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, industry })
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        setStatus(payload.message ?? 'Något gick fel. Försök igen.');
      } else {
        setStatus(payload.message ?? 'Tack, du är nu anmäld.');
        setEmail('');
      }
    } catch {
      setStatus('Nätverksfel. Kontrollera anslutning och testa igen.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel subscribe">
      <h3>Dagligt utskick</h3>
      <p>Anmäl dig för att få en kort briefing varje morgon.</p>
      <form onSubmit={onSubmit}>
        <div className="form-row">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="din.email@foretag.se"
            required
          />
          <select
            value={industry}
            onChange={(event) => setIndustry(event.target.value as Industry)}
            required
          >
            {INDUSTRIES.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Skickar...' : 'Prenumerera'}
        </button>
        {status ? <p className="feedback">{status}</p> : null}
      </form>
    </section>
  );
}
