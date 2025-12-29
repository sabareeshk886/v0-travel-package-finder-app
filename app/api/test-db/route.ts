import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export const dynamic = 'force-dynamic';

export async function GET() {
    const results: any = {
        timestamp: new Date().toISOString(),
        environment: 'vercel',
        databaseUrl: process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':****@') || 'NOT_SET',
    };

    // Test 1: Direct connection (port 5432)
    try {
        const directUrl = process.env.DATABASE_URL || "";
        const pool1 = new Pool({
            connectionString: directUrl,
            ssl: { rejectUnauthorized: false },
            connectionTimeoutMillis: 5000,
            max: 1
        });
        const result = await pool1.query('SELECT NOW()');
        await pool1.end();
        results.port5432 = { status: '✅ Connected', time: result.rows[0].now };
    } catch (error: any) {
        results.port5432 = {
            status: '❌ Failed',
            error: error.message,
            code: error.code,
            detail: error.detail,
        };
    }

    // Test 2: Pooler connection (port 6543)
    try {
        const poolerUrl = (process.env.DATABASE_URL || "").replace(":5432", ":6543");
        const pool2 = new Pool({
            connectionString: poolerUrl,
            ssl: { rejectUnauthorized: false },
            connectionTimeoutMillis: 5000,
            max: 1
        });
        const result = await pool2.query('SELECT NOW()');
        await pool2.end();
        results.port6543 = { status: '✅ Connected', time: result.rows[0].now };
    } catch (error: any) {
        results.port6543 = {
            status: '❌ Failed',
            error: error.message,
            code: error.code,
            detail: error.detail,
        };
    }

    return NextResponse.json(results, { status: 200 });
}
