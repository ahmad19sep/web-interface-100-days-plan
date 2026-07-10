// Server-only Postgres access (Neon or any standard Postgres). Never import
// this from a "use client" file — route handlers and server code only.

import { Pool, type QueryResultRow } from "pg";

let pool: Pool | null = null;

function getPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new DbNotConfiguredError();
  }
  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: connectionString.includes("sslmode=disable")
        ? undefined
        : { rejectUnauthorized: false },
    });
  }
  return pool;
}

export class DbNotConfiguredError extends Error {
  constructor() {
    super(
      "DATABASE_URL is not set — connect a Postgres database (see db/schema.sql) before using accounts."
    );
    this.name = "DbNotConfiguredError";
  }
}

export async function query<R extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = []
): Promise<R[]> {
  const { rows } = await getPool().query<R>(text, params);
  return rows;
}

// Self-healing migration for profiles.avatar (added after first deploy;
// DATABASE_URL is a sensitive env var, so schema.sql can't be run by hand
// from a dev machine). Idempotent, one statement per server instance.
let avatarColumnReady: Promise<unknown> | null = null;
export function ensureAvatarColumn(): Promise<unknown> {
  if (!avatarColumnReady) {
    avatarColumnReady = query(
      "alter table profiles add column if not exists avatar text not null default 'bot'"
    ).catch((err) => {
      avatarColumnReady = null; // retry on the next request
      throw err;
    });
  }
  return avatarColumnReady;
}
