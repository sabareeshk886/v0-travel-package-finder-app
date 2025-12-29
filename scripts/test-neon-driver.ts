import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Configure neon to use WebSocket
neonConfig.webSocketConstructor = ws;

const connectionString = "postgresql://postgres:Jyothi%409947794714@db.ymytrwjuejmacmogwwfo.supabase.co:5432/postgres";

async function main() {
    console.log("🚀 Testing Neon Serverless Driver...");

    const pool = new Pool({ connectionString });

    try {
        // Test 1: Simple query
        const result = await pool.query('SELECT NOW() as now, current_database() as db');
        console.log("✅ Connection successful!");
        console.log("Time:", result.rows[0].now);
        console.log("Database:", result.rows[0].db);

        // Test 2: Query leads table
        const leadsResult = await pool.query('SELECT COUNT(*) FROM leads');
        console.log("✅ Leads table accessible!");
        console.log("Lead count:", leadsResult.rows[0].count);

        console.log("\n✨ Neon serverless driver works with your Supabase database!");

    } catch (error: any) {
        console.error("❌ Connection failed!");
        console.error("Error:", error.message);
        console.error("Code:", error.code);
    } finally {
        await pool.end();
    }
}

main();
