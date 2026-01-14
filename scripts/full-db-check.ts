import { db } from '../lib/db';
import { sql } from 'drizzle-orm';
import { leads, trips, users } from '../lib/schema';

async function fullCheck() {
    console.log('🔍 Full Database Status Check\n');
    console.log('═'.repeat(60));

    // 1. Connection test
    console.log('\n1️⃣ Testing Connection...');
    try {
        await db.execute(sql`SELECT NOW()`);
        console.log('   ✅ Database connection OK');
    } catch (error: any) {
        console.log(`   ❌ Connection failed: ${error.message}`);
        process.exit(1);
    }

    // 2. Check main CRM tables
    console.log('\n2️⃣ Checking CRM Tables...');
    const tables = [
        { name: 'leads', table: leads },
        { name: 'trips', table: trips },
        { name: 'users', table: users },
    ];

    for (const { name, table } of tables) {
        try {
            const result = await db.select().from(table).limit(5);
            console.log(`   ✅ ${name.padEnd(15)} ${result.length} rows (showing first 5)`);
            if (result.length > 0) {
                console.log(`      Sample: ${JSON.stringify(result[0]).substring(0, 80)}...`);
            }
        } catch (error: any) {
            console.log(`   ❌ ${name.padEnd(15)} Error: ${error.message}`);
        }
    }

    // 3. Check all tables count
    console.log('\n3️⃣ All Tables Row Count...');
    const allTables = ['leads', 'trips', 'users', 'quotations', 'vendors', 'follow_ups', 'payments', 'expenses', 'trip_room_bookings'];

    for (const tableName of allTables) {
        try {
            const result = await db.execute(sql.raw(`SELECT COUNT(*) as count FROM "${tableName}"`));
            const count = result.rows[0]?.count || 0;
            console.log(`   ${tableName.padEnd(25)} ${count} rows`);
        } catch (error: any) {
            console.log(`   ${tableName.padEnd(25)} Error: ${error.message.substring(0, 40)}`);
        }
    }

    console.log('\n' + '═'.repeat(60));
    console.log('✨ Check complete!');
    process.exit(0);
}

fullCheck();
