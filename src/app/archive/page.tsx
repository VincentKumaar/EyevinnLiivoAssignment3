import { listBriefings } from '@/lib/briefing-service';
import { formatSwedishDate } from '@/lib/date';

export const dynamic = 'force-dynamic';

export default async function ArchivePage() {
  const briefings = await listBriefings(90);

  return (
    <main className="page-grid">
      <section className="panel hero">
        <h2>Arkiv</h2>
        <p>Här hittar du tidigare dagliga briefings.</p>
      </section>

      <section className="archive-list">
        {briefings.length === 0 ? (
          <article className="archive-item">
            <h3>Inga briefings ännu</h3>
            <p>Arkivet fylls på automatiskt när första dagliga briefing har genererats.</p>
          </article>
        ) : (
          briefings.map((briefing) => (
            <article key={briefing.id} className="archive-item">
              <h3>{formatSwedishDate(briefing.date)}</h3>
              <p>{briefing.summary}</p>
              <p className="hero-meta">Antal hot: {briefing.threats.length}</p>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
