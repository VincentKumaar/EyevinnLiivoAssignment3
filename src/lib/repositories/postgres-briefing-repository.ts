import { Pool } from 'pg';
import { DailyBriefing } from '@/lib/types';
import { BriefingRepository } from '@/lib/repositories/briefing-repository';

export class PostgresBriefingRepository implements BriefingRepository {
  private initialized = false;

  constructor(private readonly pool: Pool) {}

  private async ensureTable(): Promise<void> {
    if (this.initialized) {
      return;
    }

    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS briefings (
        id TEXT PRIMARY KEY,
        date DATE UNIQUE NOT NULL,
        generated_at TIMESTAMPTZ NOT NULL,
        title TEXT NOT NULL,
        summary TEXT NOT NULL,
        threats JSONB NOT NULL
      )
    `);

    this.initialized = true;
  }

  async getByDate(date: string): Promise<DailyBriefing | null> {
    await this.ensureTable();

    const result = await this.pool.query(
      `
        SELECT id, date::text AS date, generated_at, title, summary, threats
        FROM briefings
        WHERE date = $1
        LIMIT 1
      `,
      [date]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];

    return {
      id: row.id,
      date: row.date,
      generatedAt: new Date(row.generated_at).toISOString(),
      title: row.title,
      summary: row.summary,
      threats: row.threats
    };
  }

  async list(limit = 30): Promise<DailyBriefing[]> {
    await this.ensureTable();

    const result = await this.pool.query(
      `
        SELECT id, date::text AS date, generated_at, title, summary, threats
        FROM briefings
        ORDER BY date DESC
        LIMIT $1
      `,
      [Math.max(1, limit)]
    );

    return result.rows.map((row) => ({
      id: row.id,
      date: row.date,
      generatedAt: new Date(row.generated_at).toISOString(),
      title: row.title,
      summary: row.summary,
      threats: row.threats
    }));
  }

  async save(briefing: DailyBriefing): Promise<void> {
    await this.ensureTable();

    await this.pool.query(
      `
        INSERT INTO briefings (id, date, generated_at, title, summary, threats)
        VALUES ($1, $2, $3, $4, $5, $6::jsonb)
        ON CONFLICT (date)
        DO UPDATE SET
          id = EXCLUDED.id,
          generated_at = EXCLUDED.generated_at,
          title = EXCLUDED.title,
          summary = EXCLUDED.summary,
          threats = EXCLUDED.threats
      `,
      [
        briefing.id,
        briefing.date,
        briefing.generatedAt,
        briefing.title,
        briefing.summary,
        JSON.stringify(briefing.threats)
      ]
    );
  }
}
