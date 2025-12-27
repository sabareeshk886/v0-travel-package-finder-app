const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

async function runMigration() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false } // Required for Supabase/Neon usually
    });

    try {
        await client.connect();
        console.log('Connected to database.');

        const migrationFile = process.argv[2];
        if (!migrationFile) {
            console.error('Please provide a migration file path.');
            process.exit(1);
        }

        const sql = fs.readFileSync(migrationFile, 'utf8');
        console.log(`Running migration: ${migrationFile}`);

        await client.query(sql);
        console.log('Migration completed successfully.');
    } catch (err) {
        console.error('Error running migration:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

runMigration();
