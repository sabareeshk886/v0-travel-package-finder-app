
import { Pool } from 'pg';

// Original URL: postgresql://postgres:Jyothi%409947794714@db.ymytrwjuejmacmogwwfo.supabase.co:5432/postgres
// Replacing 5432 with 6543 for Transaction Pooler
const connectionString = "postgresql://postgres:Sabareesh%4099@db.ymytrwjuejmacmogwwfo.supabase.co:6543/postgres";

async function main() {
    // PgBouncer often requires no SSL verification or specific SSL modes. We try relaxed SSL.
    const pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000
    });

    try {
        console.log("🚀 Testing Connection to Transaction Pooler (Port 6543)...");

        const res = await pool.query('SELECT NOW() as now');
        console.log("✅ SUCCESS! Connected to Port 6543.");
        console.log("Time:", res.rows[0].now);

        console.log("testing simple query leads...");
        const leads = await pool.query('SELECT count(*) FROM leads');
        console.log("Leads count:", leads.rows[0].count);

    } catch (err: any) {
        console.error("❌ FAILED to connect to Port 6543.");
        console.error("Error:", err.message);
        console.error("Code:", err.code);
    } finally {
        await pool.end();
    }
}

main();
