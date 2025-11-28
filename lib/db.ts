// lib/db.ts
import { Pool } from "pg";

/**
 * Use a global variable to avoid creating multiple pools during hot reload
 * in Next.js dev mode.
 */
declare global {
  // eslint-disable-next-line no-var
  var __pgPool__: Pool | undefined;
}

const pool =
  global.__pgPool__ ??
  new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432,
  });

if (!global.__pgPool__) global.__pgPool__ = pool;

export const db = pool;    // named export (matches your import)
export default pool;       // also keep default export (optional)
