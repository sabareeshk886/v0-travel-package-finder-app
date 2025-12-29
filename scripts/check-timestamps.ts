
import { Pool } from 'pg';

const connectionString = "postgresql://postgres:Jyothi%409947794714@db.ymytrwjuejmacmogwwfo.supabase.co:5432/postgres";

async function main() {
    const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });

    try {
        console.log("🚀 Checking specific columns...");

        const res = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'leads'
    `);

        const columns = res.rows.map(r => r.column_name);
        console.log("Found columns:", columns.join(', '));

        const hasCreatedAt = columns.includes('created_at');
        const hasUpdatedAt = columns.includes('updated_at');

        if (!hasCreatedAt) console.log("❌ MISSING: created_at");
        else console.log("✅ FOUND: created_at");

        if (!hasUpdatedAt) console.log("❌ MISSING: updated_at");
        else console.log("✅ FOUND: updated_at");

    } catch (err: any) {
        console.error("❌ Error:", err.message);
    } finally {
        await pool.end();
    }
}

main();
