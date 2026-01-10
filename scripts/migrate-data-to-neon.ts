import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Supabase connection
const supabasePool = new Pool({
    connectionString: 'postgresql://postgres:Jyothi%409947794714@db.ymytrwjuejmacmogwwfo.supabase.co:5432/postgres',
    ssl: { rejectUnauthorized: false },
});

// Neon connection (from .env.local)
const neonPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

async function getTables() {
    const result = await supabasePool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name;
    `);
    return result.rows.map(row => row.table_name);
}

async function getTableData(tableName: string) {
    try {
        const result = await supabasePool.query(`SELECT * FROM "${tableName}"`);
        return result.rows;
    } catch (error) {
        console.error(`Error fetching data from ${tableName}:`, error);
        return [];
    }
}

async function copyTable(tableName: string) {
    console.log(`\n📋 Migrating table: ${tableName}`);

    const data = await getTableData(tableName);

    if (data.length === 0) {
        console.log(`   ⚠️  No data found in ${tableName}, skipping...`);
        return { tableName, rows: 0, success: true };
    }

    console.log(`   📊 Found ${data.length} rows to migrate`);

    try {
        // Get column names from first row
        const columns = Object.keys(data[0]);
        const columnList = columns.map(col => `"${col}"`).join(', ');

        // Disable triggers during insert to avoid constraint issues
        await neonPool.query(`ALTER TABLE "${tableName}" DISABLE TRIGGER ALL`);

        let successCount = 0;
        let errorCount = 0;

        // Insert data row by row
        for (const row of data) {
            try {
                const values = columns.map(col => row[col]);
                const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

                await neonPool.query(
                    `INSERT INTO "${tableName}" (${columnList}) VALUES (${placeholders})`,
                    values
                );
                successCount++;
            } catch (error: any) {
                errorCount++;
                if (errorCount <= 3) { // Only log first 3 errors per table
                    console.error(`   ❌ Error inserting row:`, error.message);
                }
            }
        }

        // Re-enable triggers
        await neonPool.query(`ALTER TABLE "${tableName}" ENABLE TRIGGER ALL`);

        console.log(`   ✅ Successfully migrated ${successCount}/${data.length} rows`);
        if (errorCount > 0) {
            console.log(`   ⚠️  Failed to migrate ${errorCount} rows`);
        }

        return { tableName, rows: successCount, errors: errorCount, success: true };
    } catch (error: any) {
        console.error(`   ❌ Failed to migrate ${tableName}:`, error.message);
        return { tableName, rows: 0, errors: data.length, success: false, error: error.message };
    }
}

async function migrateData() {
    console.log('🚀 Starting data migration from Supabase to Neon...\n');

    try {
        // Test connections
        console.log('🔌 Testing database connections...');
        await supabasePool.query('SELECT NOW()');
        console.log('   ✅ Supabase connection OK');

        await neonPool.query('SELECT NOW()');
        console.log('   ✅ Neon connection OK');

        // Get list of tables
        console.log('\n📑 Fetching table list from Supabase...');
        const tables = await getTables();
        console.log(`   Found ${tables.length} tables to migrate:`);
        tables.forEach(table => console.log(`   - ${table}`));

        // Migrate each table
        console.log('\n🔄 Starting migration...');
        const results = [];

        for (const table of tables) {
            const result = await copyTable(table);
            results.push(result);
        }

        // Summary
        console.log('\n\n📊 Migration Summary:');
        console.log('═'.repeat(60));

        let totalRows = 0;
        let totalErrors = 0;
        let successTables = 0;
        let failedTables = 0;

        results.forEach(result => {
            if (result.success && result.rows > 0) {
                console.log(`✅ ${result.tableName.padEnd(30)} ${result.rows} rows`);
                totalRows += result.rows;
                successTables++;
            } else if (!result.success) {
                console.log(`❌ ${result.tableName.padEnd(30)} FAILED`);
                failedTables++;
            }
            totalErrors += result.errors || 0;
        });

        console.log('═'.repeat(60));
        console.log(`\nTotal rows migrated: ${totalRows}`);
        console.log(`Successful tables: ${successTables}`);
        console.log(`Failed tables: ${failedTables}`);
        if (totalErrors > 0) {
            console.log(`⚠️  Total errors: ${totalErrors}`);
        }
        console.log('\n✨ Migration complete!');

    } catch (error) {
        console.error('\n❌ Migration failed:', error);
    } finally {
        await supabasePool.end();
        await neonPool.end();
    }
}

// Run migration
migrateData().catch(console.error);
