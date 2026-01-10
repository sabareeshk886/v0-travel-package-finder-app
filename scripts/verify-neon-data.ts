import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function verifyMigration() {
    console.log('🔍 Verifying data in Neon database...\n');

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });

    try {
        // Get all tables
        const tablesResult = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            ORDER BY table_name;
        `);

        console.log(`📊 Tables in Neon database:\n`);
        console.log('═'.repeat(60));

        let totalRows = 0;
        const tablesWithData = [];

        for (const row of tablesResult.rows) {
            const tableName = row.table_name;
            const countResult = await pool.query(`SELECT COUNT(*) as count FROM "${tableName}"`);
            const count = parseInt(countResult.rows[0].count);
            totalRows += count;

            if (count > 0) {
                console.log(`✅ ${tableName.padEnd(30)} ${count} rows`);
                tablesWithData.push({ table: tableName, rows: count });
            } else {
                console.log(`⚪ ${tableName.padEnd(30)} 0 rows`);
            }
        }

        console.log('═'.repeat(60));
        console.log(`\nTotal rows across all tables: ${totalRows}`);
        console.log(`Tables with data: ${tablesWithData.length}/${tablesResult.rows.length}`);

        if (tablesWithData.length > 0) {
            console.log('\n✨ Migration successful for these tables:');
            tablesWithData.forEach(t => console.log(`   - ${t.table}: ${t.rows} rows`));
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await pool.end();
    }
}

verifyMigration();
