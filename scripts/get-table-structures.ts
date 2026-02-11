import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function getTableStructures() {
    console.log('📋 COMPLETE DATABASE STRUCTURE DOCUMENTATION\n');

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

        console.log('═'.repeat(100));
        console.log(`Found ${tablesResult.rows.length} tables\n`);

        for (const tableRow of tablesResult.rows) {
            const tableName = tableRow.table_name;

            // Get column information
            const columnsResult = await pool.query(`
                SELECT 
                    column_name,
                    data_type,
                    character_maximum_length,
                    is_nullable,
                    column_default
                FROM information_schema.columns
                WHERE table_schema = 'public' 
                AND table_name = $1
                ORDER BY ordinal_position;
            `, [tableName]);

            // Get row count
            const countResult = await pool.query(`SELECT COUNT(*) as count FROM "${tableName}"`);
            const rowCount = parseInt(countResult.rows[0].count);

            console.log('═'.repeat(100));
            console.log(`\n📊 TABLE: ${tableName.toUpperCase()}`);
            console.log(`   Rows: ${rowCount}`);
            console.log('─'.repeat(100));
            console.log(`\n${'COLUMN NAME'.padEnd(30)} ${'DATA TYPE'.padEnd(25)} ${'NULLABLE'.padEnd(10)} ${'DEFAULT'.padEnd(20)}`);
            console.log('─'.repeat(100));

            columnsResult.rows.forEach((col: any) => {
                const colName = col.column_name.padEnd(30);
                let dataType = col.data_type;
                if (col.character_maximum_length) {
                    dataType += `(${col.character_maximum_length})`;
                }
                dataType = dataType.padEnd(25);
                const nullable = col.is_nullable.padEnd(10);
                const defaultVal = (col.column_default || '-').substring(0, 20).padEnd(20);

                console.log(`${colName} ${dataType} ${nullable} ${defaultVal}`);
            });

            console.log('');

            // Show sample data if exists
            if (rowCount > 0) {
                const sampleResult = await pool.query(`SELECT * FROM "${tableName}" LIMIT 1`);
                if (sampleResult.rows.length > 0) {
                    console.log('📝 SAMPLE DATA:');
                    console.log(JSON.stringify(sampleResult.rows[0], null, 2));
                    console.log('');
                }
            }
        }

        console.log('═'.repeat(100));
        console.log('\n✅ Documentation complete!\n');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await pool.end();
    }
}

getTableStructures();
