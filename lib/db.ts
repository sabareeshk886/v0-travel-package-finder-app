import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
}

// Use the DATABASE_URL directly - Supabase PostgreSQL connection
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 10,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 20000,
});

export const usedDbUrl = connectionString;
export const db = drizzle(pool, { schema });
