
import { Pool } from 'pg';

const connectionString = "postgresql://postgres:Jyothi%409947794714@db.ymytrwjuejmacmogwwfo.supabase.co:5432/postgres";

async function main() {
    const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });

    try {
        console.log("🚀 Running the failing query...");

        // Exact columns from the screenshot
        const query = `
      select "id", "lead_source", "customer_name", "phone", "email", "destination", "travel_dates", "no_of_pax", "no_of_staff", 
      "lead_guest_name", "pickup_point", "budget", "special_requirements", "status", "assigned_to", "priority", "notes", 
      "created_by", "created_at", "updated_at" 
      from "leads" 
      where "leads"."status" <> $1 
      order by "leads"."created_at" desc
    `;

        const res = await pool.query(query, ['converted']);
        console.log(`✅ Success! Retrieved ${res.rows.length} rows.`);
        if (res.rows.length > 0) {
            console.log("Sample Data:", res.rows[0]);
        }

    } catch (err: any) {
        console.error("❌ QUERY FAILED!");
        console.error("Message:", err.message);
        console.error("Code:", err.code);
        console.error("Detail:", err.detail);
        console.error("Hint:", err.hint);
    } finally {
        await pool.end();
    }
}

main();
