const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // ssl: { rejectUnauthorized: false } // Commented out to test non-SSL
});

async function verify() {
    try {
        console.log("Testing database connection (no SSL)...");
        const client = await pool.connect();
        console.log("Connected!");
        const result = await client.query('SELECT NOW()');
        console.log("Query successful!", result.rows[0]);

        console.log("Checking for tables...");
        const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

        const tableNames = tables.rows.map(r => r.table_name);
        console.log("Tables found:", tableNames);

        client.release();
        process.exit(0);
    } catch (error) {
        console.error("Verification failed!");
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error code:", error.code);
        process.exit(1);
    }
}

verify();
