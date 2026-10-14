import { Pool } from "pg";

let pool: Pool;

export function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

    if (connectionString) {
      pool = new Pool({
        connectionString,
        ssl: {
          rejectUnauthorized: false,
        },
        max: 10,
        idleTimeoutMillis: 30000,
      });
    } else {
      pool = new Pool({
        user: process.env.PGUSER || "saif",
        host: process.env.PGHOST || "localhost",
        database: process.env.PGDATABASE || "dental_crm",
        port: Number(process.env.PGPORT) || 5432,
        password: process.env.PGPASSWORD || undefined,
        max: 10,
        idleTimeoutMillis: 30000,
      });
    }
  }
  return pool;
}
