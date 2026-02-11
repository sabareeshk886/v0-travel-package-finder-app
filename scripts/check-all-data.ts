import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function checkAllData() {
    console.log('🔍 COMPREHENSIVE DATABASE CHECK\n');

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

        console.log('📊 DATABASE SUMMARY');
        console.log('═'.repeat(80));
        console.log(`\nTotal tables found: ${tablesResult.rows.length}\n`);

        let totalRows = 0;
        const tablesWithData: any[] = [];
        const emptyTables: string[] = [];

        for (const row of tablesResult.rows) {
            const tableName = row.table_name;
            const countResult = await pool.query(`SELECT COUNT(*) as count FROM "${tableName}"`);
            const count = parseInt(countResult.rows[0].count);
            totalRows += count;

            if (count > 0) {
                tablesWithData.push({ table: tableName, rows: count });
                console.log(`✅ ${tableName.padEnd(30)} ${count} rows`);

                // Show sample data for tables with content
                const sampleData = await pool.query(`SELECT * FROM "${tableName}" LIMIT 2`);
                if (sampleData.rows.length > 0) {
                    console.log(`   Sample record columns: ${Object.keys(sampleData.rows[0]).join(', ')}`);
                }
                console.log('');
            } else {
                emptyTables.push(tableName);
            }
        }

        // Show empty tables
        if (emptyTables.length > 0) {
            console.log('\n⚪ EMPTY TABLES:');
            console.log('─'.repeat(80));
            emptyTables.forEach(table => console.log(`   - ${table}`));
        }

        console.log('\n' + '═'.repeat(80));
        console.log(`\n📈 OVERALL STATISTICS:`);
        console.log(`   Total rows across all tables: ${totalRows}`);
        console.log(`   Tables with data: ${tablesWithData.length}/${tablesResult.rows.length}`);
        console.log(`   Empty tables: ${emptyTables.length}/${tablesResult.rows.length}`);

        if (tablesWithData.length > 0) {
            console.log('\n✨ TABLES WITH DATA:');
            tablesWithData.forEach(t => console.log(`   - ${t.table}: ${t.rows} rows`));
        } else {
            console.log('\n⚠️  NO DATA FOUND IN ANY TABLE');
        }

        console.log('\n' + '═'.repeat(80));

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await pool.end();
    }
}

checkAllData();
