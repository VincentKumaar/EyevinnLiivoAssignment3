import { Pool } from 'pg';
import { Subscriber } from '@/lib/types';
import { SubscriberRepository } from '@/lib/repositories/subscriber-repository';

export class PostgresSubscriberRepository implements SubscriberRepository {
  private initialized = false;

  constructor(private readonly pool: Pool) {}

  private async ensureTable(): Promise<void> {
    if (this.initialized) {
      return;
    }

    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS subscribers (
        email TEXT PRIMARY KEY,
        industry TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL
      )
    `);

    this.initialized = true;
  }

  async save(subscriber: Subscriber): Promise<void> {
    await this.ensureTable();

    await this.pool.query(
      `
        INSERT INTO subscribers (email, industry, created_at)
        VALUES ($1, $2, $3)
        ON CONFLICT (email)
        DO UPDATE SET
          industry = EXCLUDED.industry,
          created_at = EXCLUDED.created_at
      `,
      [subscriber.email.toLowerCase(), subscriber.industry, subscriber.createdAt]
    );
  }
}
