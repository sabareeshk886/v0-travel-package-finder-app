
import { db } from "../lib/db";
import { south } from "../lib/schema";
import { like } from "drizzle-orm";

async function main() {
    console.log("🔍 Debugging South Table...");

    // 1. Check total count
    const allRows = await db.select().from(south);
    console.log(`📊 Total rows in 'south' table: ${allRows.length}`);

    if (allRows.length > 0) {
        console.log("First row:", JSON.stringify(allRows[0], null, 2));
    }

    // 2. Simulate Search Logic
    const duration = "2D3N";
    const durationCode = duration.replace("D", "").replace("N", ""); // "23"
    const prefix = `FWS${durationCode.charAt(0)}`; // "FWS2"

    console.log(`🔎 Filtering with prefix: '${prefix}%'`);

    const filtered = await db.select().from(south).where(like(south.trip_code, `${prefix}%`));
    console.log(`🎯 Rows matching prefix '${prefix}': ${filtered.length}`);

    // 3. Check for specific trip code
    const specific = await db.select().from(south).where(like(south.trip_code, 'FWS202%'));
    console.log(`🎯 Rows matching 'FWS202': ${specific.length}`);

    if (filtered.length === 0 && allRows.length > 0) {
        console.log("⚠️ Total mismatch! Rows exist but filter 'FWS2%' found nothing.");
        console.log("Sample trip_codes:", allRows.slice(0, 5).map(r => r.trip_code));
    }
}

main().catch(console.error);
