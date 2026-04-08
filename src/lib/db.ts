import { Pool } from 'pg';

let pool: Pool | null | undefined;

export function getDbPool(): Pool | null {
  if (pool !== undefined) {
    return pool;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    pool = null;
    return pool;
  }

  pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  return pool;
}

export function isPostgresConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
