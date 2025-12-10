const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // ssl: { rejectUnauthorized: false } 
});

async function migrate() {
    try {
        console.log("Reading migration file...");
        const sqlPath = path.join(__dirname, '../drizzle/0000_powerful_rawhide_kid.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log("Executing migration...");
        const client = await pool.connect();
        await client.query(sql);
        console.log("Migration completed successfully!");

        client.release();
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

migrate();
