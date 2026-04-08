'use client';

import { useMemo, useState } from 'react';
import { DailyBriefing, INDUSTRIES, Industry, Severity, ThreatItem } from '@/lib/types';

function severityClass(severity: Severity): string {
  if (severity === 'kritisk') {
    return 'critical';
  }
  if (severity === 'hög') {
    return 'high';
  }
  if (severity === 'medel') {
    return 'medium';
  }
  return 'low';
}

function ThreatCard({ threat, industry }: { threat: ThreatItem; industry: Industry }) {
  const badgeClass = severityClass(threat.severity);

  return (
    <article className={`threat-card ${badgeClass}`}>
      <div className="threat-top">
        <h3 className="threat-title">{threat.title}</h3>
        <span className={`severity ${badgeClass}`}>{threat.severity}</span>
      </div>

      <p className="label">Vad har hänt?</p>
      <p className="copy">{threat.happened}</p>

      <p className="label">Påverkar det här oss?</p>
      <p className="copy">{threat.relevanceByIndustry[industry]}</p>

      <p className="label">Rekommendation</p>
      <p className="copy">{threat.recommendation}</p>

      <p className="source">Källa: {threat.source}</p>
    </article>
  );
}

export function ThreatDashboard({ briefing }: { briefing: DailyBriefing }) {
  const [industry, setIndustry] = useState<Industry>('finans');

  const threatCards = useMemo(
    () => briefing.threats.map((threat) => <ThreatCard key={threat.id} threat={threat} industry={industry} />),
    [briefing.threats, industry]
  );

  return (
    <section className="panel hero">
      <div className="dashboard-head">
        <h2>Dagens viktigaste hot</h2>
        <label>
          <span className="label" style={{ marginTop: 0 }}>Välj bransch</span>
          <select
            className="industry-select"
            value={industry}
            onChange={(event) => setIndustry(event.target.value as Industry)}
          >
            {INDUSTRIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="threat-grid">{threatCards}</div>
    </section>
  );
}
