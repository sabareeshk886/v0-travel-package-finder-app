import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
}

// Use Transaction Pooler (port 6543) for Vercel/Serverless to connection stability
const originalUrl = process.env.DATABASE_URL || "";
const poolerUrl = originalUrl.replace(":5432", ":6543");

const pool = new Pool({
    connectionString: poolerUrl,
    ssl: { rejectUnauthorized: false },
    max: 1, // Limit to 1 connection per serverless function instance to prevent exhaustion
    connectionTimeoutMillis: 5000, // Fail fast if connection takes too long
    idleTimeoutMillis: 20000, // Close idle connections to free up resources
});

export const db = drizzle(pool, { schema });
