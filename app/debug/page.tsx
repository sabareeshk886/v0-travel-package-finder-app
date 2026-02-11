
import { db } from "@/lib/db"
import { north, south } from "@/lib/schema"

export default async function DebugPage() {
    let southData, northData;
    let southKeys, northKeys;

    let dbUrl = "process.env.DATABASE_URL is missing";
    if (process.env.DATABASE_URL) {
        dbUrl = process.env.DATABASE_URL.replace(/:[^:@]*@/, ":***@");
    }
    console.log("DB URL (Masked):", dbUrl);

    try {
        southData = await db.execute(`SELECT * FROM south LIMIT 10`);
        southData = southData.rows;
        // southData = await db.select().from(south).limit(10); // Commented out to test raw
        southKeys = southData.length > 0 ? Object.keys(southData[0]) : [];
    } catch (err: any) {
        console.error("SQL Error (South):", err);
        southData = [{ error: err.message, stack: err.stack, dbUrl }];
    }

    try {
        northData = await db.select().from(north).limit(10);
        northKeys = northData.length > 0 ? Object.keys(northData[0]) : [];
    } catch (err: any) {
        console.error("SQL Error (North):", err);
        northData = [{ error: err.message, code: err.code, detail: err.detail, hint: err.hint }];
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Database Debug</h1>

            <div className="grid grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-semibold mb-2">North Table</h2>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[500px]">
                        {JSON.stringify({ keys: northKeys, rows: northData }, null, 2)}
                    </pre>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">South Table</h2>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[500px]">
                        {JSON.stringify({ keys: southKeys, rows: southData }, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    )
}
