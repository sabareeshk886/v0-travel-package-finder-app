import { Pool } from 'pg';
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
    const connectionString = process.env.DATABASE_URL;

    console.log("🔍 Testing Supabase Connection (Port 5432)...");
    console.log("📍 Connection string:", connectionString?.replace(/:[^:@]*@/, ':****@'));

    const pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000
    });

    try {
        console.log("\n⏳ Connecting to database...");
        const res = await pool.query('SELECT NOW() as now, current_database() as db');
        console.log("✅ SUCCESS! Connected to Supabase.");
        console.log("📊 Database:", res.rows[0].db);
        console.log("🕐 Server time:", res.rows[0].now);

        console.log("\n🔍 Testing table access...");
        const tables = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            LIMIT 5
        `);
        console.log("📋 Found tables:", tables.rows.map(r => r.table_name).join(', '));

    } catch (err: any) {
        console.error("\n❌ FAILED to connect to Supabase.");
        console.error("Error:", err.message);
        console.error("Code:", err.code);

        if (err.code === 'ENOTFOUND') {
            console.error("\n💡 DNS resolution failed. Please check:");
            console.error("   - Internet connection");
            console.error("   - Supabase project is not paused");
            console.error("   - Database hostname is correct");
        }
    } finally {
        await pool.end();
    }
}

main();
