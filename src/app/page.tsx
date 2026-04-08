import { SubscribeForm } from '@/components/SubscribeForm';
import { ThreatDashboard } from '@/components/ThreatDashboard';
import { formatSwedishDate } from '@/lib/date';
import { getTodayBriefing, listBriefings } from '@/lib/briefing-service';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const todayBriefing = await getTodayBriefing();
  const recent = (await listBriefings(5)).filter((item) => item.date !== todayBriefing.date);

  return (
    <main className="page-grid">
      <section className="panel hero">
        <h2>{formatSwedishDate(todayBriefing.date)}</h2>
        <p>{todayBriefing.summary}</p>
        <p className="hero-meta">
          Genererad: {new Date(todayBriefing.generatedAt).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </section>

      <ThreatDashboard briefing={todayBriefing} />

      <SubscribeForm />

      <section className="panel hero">
        <h2>Senaste arkivet</h2>
        {recent.length === 0 ? (
          <p>Arkivet fylls på automatiskt när nya briefings skapas.</p>
        ) : (
          <div className="archive-list">
            {recent.map((entry) => (
              <article key={entry.id} className="archive-item">
                <h3>{formatSwedishDate(entry.date)}</h3>
                <p>{entry.summary}</p>
              </article>
            ))}
          </div>
        )}
        <a className="inline-link" href="/archive">
          Öppna hela arkivet
        </a>
      </section>
    </main>
  );
}
