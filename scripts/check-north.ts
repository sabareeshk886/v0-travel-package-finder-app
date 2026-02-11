
import { Pool } from 'pg';
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000 // 5s timeout per attempt
    });

    const maxRetries = 6;
    for (let i = 0; i < maxRetries; i++) {
        try {
            console.log(`\n🔄 Attempt ${i + 1}/${maxRetries}: Checking 'north' table...`);
            // Query for count
            const res = await pool.query('SELECT count(*) FROM north');
            console.log("✅ Count:", res.rows[0].count);

            if (parseInt(res.rows[0].count) > 0) {
                console.log("ℹ️ Table appears to be populated.");
                // Fetch sample
                const sample = await pool.query('SELECT * FROM north LIMIT 3');
                console.table(sample.rows);
            } else {
                console.log("⚠️ Table is empty.");
            }
            break; // Success!

        } catch (err: any) {
            console.error(`❌ Attempt ${i + 1} failed:`, err.message);
            if (i < maxRetries - 1) {
                console.log("⏳ Retrying in 5s...");
                await new Promise(resolve => setTimeout(resolve, 5000));
            } else {
                console.error("❌ All retry attempts failed. Please check your internet connection or Supabase status.");
            }
        }
    }
    await pool.end();
}

main();
