
import { db } from "../lib/db";
import { leads } from "../lib/schema";

async function main() {
    try {
        console.log("Testing database connection...");
        // @ts-ignore
        const result = await db.select().from(leads).limit(1);
        console.log("Connection successful!");
        console.log("Leads found:", result.length);
        process.exit(0);
    } catch (error) {
        console.error("Connection failed:", error);
        process.exit(1);
    }
}

main();
