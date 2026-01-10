import { Pool } from 'pg';

async function testSupabaseConnection() {
    console.log('🔌 Testing Supabase connection...\n');

    const connectionString = 'postgresql://postgres:Jyothi@9947794714@db.ymytrwjuejmacmogwwfo.supabase.co:5432/postgres';

    console.log('Connection string:', connectionString.replace(/:[^:@]+@/, ':***@'));

    const pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000,
    });

    try {
        const result = await pool.query('SELECT NOW() as current_time, version()');
        console.log('✅ Connection successful!');
        console.log('Current time:', result.rows[0].current_time);
        console.log('PostgreSQL version:', result.rows[0].version);

        // Try to list tables
        const tables = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            ORDER BY table_name;
        `);

        console.log(`\n📊 Found ${tables.rows.length} tables:`);
        for (const row of tables.rows) {
            const countResult = await pool.query(`SELECT COUNT(*) as count FROM "${row.table_name}"`);
            console.log(`   - ${row.table_name}: ${countResult.rows[0].count} rows`);
        }

    } catch (error: any) {
        console.error('❌ Connection failed:', error.message);
        console.error('\nPossible issues:');
        console.error('1. Supabase database might be paused or deleted');
        console.error('2. Network/firewall blocking the connection');
        console.error('3. Incorrect credentials');
        console.error('4. DNS resolution issues');
    } finally {
        await pool.end();
    }
}

testSupabaseConnection();
