import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config({ path: '.env.local' });

/**
 * Bulk insert data from SQL file
 * Usage: Place your INSERT statements in a file called 'data-to-insert.sql'
 * Then run: npx tsx scripts/bulk-insert-from-sql.ts
 */

async function bulkInsertFromSQL() {
    const sqlFilePath = './data-to-insert.sql';

    if (!fs.existsSync(sqlFilePath)) {
        console.log('❌ File not found: data-to-insert.sql');
        console.log('\n📝 Please create a file called "data-to-insert.sql" with your INSERT statements');
        console.log('\nExample format:');
        console.log('─'.repeat(80));
        console.log(`INSERT INTO b2binternational (sl_code, trip_code, details, itinerary, "2", "3", "4") 
VALUES ('SL001', 'TRIP001', 'Description', 'Itinerary', 50000, 45000, 40000);

INSERT INTO b2bnortheast (sl_code, trip_code, details, itinerary, "2", "3", "4") 
VALUES ('NE001', 'TRIP002', 'Description', 'Itinerary', 30000, 27000, 24000);
`);
        console.log('─'.repeat(80));
        return;
    }

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });

    try {
        const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');

        console.log('📝 Reading SQL file...');
        console.log(`Found ${sqlContent.split('INSERT').length - 1} INSERT statements\n`);

        console.log('🚀 Executing bulk insert...\n');

        await pool.query(sqlContent);

        console.log('✅ Bulk insert completed successfully!\n');
        console.log('Run: npx tsx scripts/verify-neon-data.ts to verify the data');

    } catch (error: any) {
        console.error('❌ Error during bulk insert:');
        console.error('Message:', error.message);
        if (error.position) {
            console.error('Error at position:', error.position);
        }
    } finally {
        await pool.end();
    }
}

bulkInsertFromSQL();
