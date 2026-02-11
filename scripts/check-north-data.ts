import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function checkNorthData() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });

    try {
        console.log('📊 Checking north table data...\n');

        const result = await pool.query(`
            SELECT sl_code, trip_code, 
                   LEFT(details, 80) as details_preview,
                   "2" as pax_2, "3" as pax_3, "4" as pax_4,
                   "20+2" as group_20, "25+2" as group_25, "30+2" as group_30
            FROM north 
            ORDER BY sl_code
        `);

        console.log(`Total records in north table: ${result.rows.length}\n`);
        console.log('═'.repeat(100));

        result.rows.forEach((row: any, index: number) => {
            console.log(`\n${index + 1}. ${row.sl_code} - ${row.trip_code}`);
            console.log(`   Details: ${row.details_preview}${row.details_preview?.length >= 80 ? '...' : ''}`);
            console.log(`   Individual pricing: 2pax=${row.pax_2 || 'NULL'}, 3pax=${row.pax_3 || 'NULL'}, 4pax=${row.pax_4 || 'NULL'}`);
            console.log(`   Group pricing: 20+2=${row.group_20 || 'NULL'}, 25+2=${row.group_25 || 'NULL'}, 30+2=${row.group_30 || 'NULL'}`);
        });

        console.log('\n' + '═'.repeat(100));

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await pool.end();
    }
}

checkNorthData();
