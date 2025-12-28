
import { db } from "@/lib/db"
import { sql } from "drizzle-orm"

export const dynamic = 'force-dynamic'

export default async function DebugPage() {
    let dbInfo = {
        connected: false,
        databaseName: "Unknown",
        host: "Unknown",
        columns: [] as string[],
        error: ""
    }

    try {
        // 1. Get Connection Details (Masked)
        const url = process.env.DATABASE_URL || ""
        // specific masking to see if it's the right host
        const simpleUrl = url.replace(/:[^:@]*@/, ':****@');

        // 2. Query Current Database Name & Host (if possible via SQL)
        const dbData = await db.execute(sql`SELECT current_database(), inet_server_addr()`)
        const currentDb = dbData.rows[0].current_database
        const serverIp = dbData.rows[0].inet_server_addr

        // 3. Query Columns for 'leads' table
        const columnsRes = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'leads'
      ORDER BY column_name
    `)

        dbInfo = {
            connected: true,
            databaseName: currentDb,
            host: serverIp || "Hidden/Cloud",
            columns: columnsRes.rows.map((r: any) => r.column_name),
            error: ""
        }

    } catch (e: any) {
        dbInfo.error = e.message
    }

    const missingColumns = ['lead_source', 'no_of_staff', 'lead_guest_name'].filter(
        c => !dbInfo.columns.includes(c)
    );

    return (
        <div className="p-8 max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Production Database Diagnostic</h1>

            <div className="p-4 border rounded bg-gray-50">
                <h2 className="font-semibold mb-2">Connection Info</h2>
                <pre className="text-xs overflow-auto bg-white p-2 rounded">
                    {JSON.stringify({
                        env_var_present: !!process.env.DATABASE_URL,
                        db_name: dbInfo.databaseName,
                        host_ip: dbInfo.host
                    }, null, 2)}
                </pre>
            </div>

            <div className="p-4 border rounded bg-gray-50">
                <h2 className="font-semibold mb-2">Schema Check (Table: leads)</h2>
                {dbInfo.error ? (
                    <div className="text-red-600 font-mono text-sm">{dbInfo.error}</div>
                ) : (
                    <>
                        <p className="mb-2">
                            Status:
                            {missingColumns.length === 0
                                ? <span className="text-green-600 font-bold ml-2">✅ SCHEMA MATCHES</span>
                                : <span className="text-red-600 font-bold ml-2">❌ SCHEMA MISMATCH</span>
                            }
                        </p>

                        {missingColumns.length > 0 && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded text-red-800">
                                <strong>MISSING COLUMNS:</strong>
                                <ul className="list-disc list-inside mt-1">
                                    {missingColumns.map(c => <li key={c}>{c}</li>)}
                                </ul>
                            </div>
                        )}

                        <details>
                            <summary className="cursor-pointer text-sm text-blue-600">View All {dbInfo.columns.length} Columns</summary>
                            <div className="mt-2 grid grid-cols-2 gap-1 text-xs font-mono bg-white p-2 rounded border">
                                {dbInfo.columns.map(c => (
                                    <span key={c} className={['lead_source', 'no_of_staff'].includes(c) ? "text-green-600 font-bold" : ""}>
                                        {c}
                                    </span>
                                ))}
                            </div>
                        </details>
                    </>
                )}
            </div>
        </div>
    )
}
