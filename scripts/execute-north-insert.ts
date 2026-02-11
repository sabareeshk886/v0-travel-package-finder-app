import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config({ path: '.env.local' });

async function insertNorthData() {
    console.log('📝 Inserting data into north table...\n');

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });

    try {
        const sqlContent = fs.readFileSync('./scripts/insert-north-data.sql', 'utf-8');

        console.log('Executing INSERT statement...\n');

        const result = await pool.query(sqlContent);

        console.log(`✅ Successfully inserted ${result.rowCount} rows into north table!\n`);

        // Verify
        const verifyResult = await pool.query('SELECT COUNT(*) as count FROM north');
        console.log(`Total rows in north table: ${verifyResult.rows[0].count}\n`);

        // Show the inserted records
        const dataResult = await pool.query(`
            SELECT sl_code, trip_code, 
                   LEFT(details, 50) as details_preview,
                   "20+2", "25+2", "30+2"
            FROM north 
            WHERE sl_code IN ('SL-100', 'SL-101', 'SL-102')
            ORDER BY sl_code
        `);

        console.log('📊 Inserted records:');
        console.log('═'.repeat(80));
        dataResult.rows.forEach((row: any) => {
            console.log(`\n${row.sl_code} - ${row.trip_code}`);
            console.log(`Details: ${row.details_preview}...`);
            console.log(`Group pricing: 20+2=${row['20+2']}, 25+2=${row['25+2']}, 30+2=${row['30+2']}`);
        });
        console.log('\n' + '═'.repeat(80));

    } catch (error: any) {
        console.error('❌ Error during insertion:');
        console.error('Message:', error.message);
        if (error.position) {
            console.error('Error at position:', error.position);
        }
        process.exit(1);
    } finally {
        await pool.end();
    }
}

insertNorthData();
