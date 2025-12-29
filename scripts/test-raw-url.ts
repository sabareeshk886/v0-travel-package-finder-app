
import { Pool } from 'pg';

// The USER provided string with UN-ENCODED '@' in the password
// "Jyothi@9947794714" -> literal '@'
const rawConnectionString = "postgresql://postgres:Jyothi@9947794714@db.ymytrwjuejmacmogwwfo.supabase.co:5432/postgres";

async function main() {
    console.log("🚀 Testing Connection with RAW (Unencoded) Password...");
    console.log("String:", rawConnectionString);

    // We expect this might fail or connect to wrong host "9947794714@db..."
    const pool = new Pool({
        connectionString: rawConnectionString,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000
    });

    try {
        const res = await pool.query('SELECT NOW() as now');
        console.log("✅ SUCCESS! The driver handled the unencoded '@' correctly.");
        console.log("Time:", res.rows[0].now);
    } catch (err: any) {
        console.error("❌ FAILED! The unencoded '@' broke the connection.");
        console.error("Error:", err.message);
        if (err.message.includes("getaddrinfo")) {
            console.error("Diagnosis: The parser likely treated part of the password as the Hostname.");
        }
    } finally {
        await pool.end();
    }
}

main();
