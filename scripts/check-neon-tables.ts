import { db } from '../lib/db';
import { sql } from 'drizzle-orm';

async function checkTables() {
    console.log('🔍 Checking Neon database tables...\n');

    const tables = ['leads', 'trips', 'users', 'quotations', 'vendors', 'follow_ups', 'payments', 'expenses'];

    for (const tableName of tables) {
        try {
            const result = await db.execute(sql`SELECT COUNT(*) as count FROM ${sql.identifier(tableName)}`);
            const count = result.rows[0]?.count || 0;
            console.log(`✅ ${tableName.padEnd(20)} ${count} rows`);
        } catch (error: any) {
            console.log(`❌ ${tableName.padEnd(20)} Error: ${error.message}`);
        }
    }

    process.exit(0);
}

checkTables();
