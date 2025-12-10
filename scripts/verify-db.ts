import { db } from "../lib/db";
import { sql } from "drizzle-orm";

async function verify() {
    try {
        console.log("Testing database connection...");
        const result = await db.execute(sql`SELECT NOW()`);
        console.log("Connection successful!", result.rows[0]);

        console.log("Checking for tables...");
        const tables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

        console.log("Tables found:", tables.rows.map((r: any) => r.table_name));

        process.exit(0);
    } catch (error) {
        console.error("Verification failed:", error);
        process.exit(1);
    }
}

verify();
