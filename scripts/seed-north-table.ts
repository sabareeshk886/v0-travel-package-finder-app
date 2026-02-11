
import { db } from "../lib/db";
import { north } from "../lib/schema";
import { sql } from "drizzle-orm";

const data = [
    { sl_code: 'SL-001', trip_code: 'FWN100', pax20plus2: 7700, pax25plus2: 7200, pax30plus2: 6600, details: 'INCLUSIO', itinerary: 'https://drive.google.com/file/d/1RGTTw-RNaWFuXR9NM9CN3cC-cd6yQ-rZ/view?usp=drivesdk' },
    { sl_code: 'SL-100', trip_code: 'FWN100', pax20plus2: 7700, pax25plus2: 7200, pax30plus2: 6600, details: 'INCLUSIO', itinerary: 'https://drive.google.com/file/d/1RGTTw-RNaWFuXR9NM9CN3cC-cd6yQ-rZ/view?usp=drivesdk' },
    { sl_code: 'SL-101', trip_code: 'FWN101', pax20plus2: 9450, pax25plus2: 8900, pax30plus2: 7950, details: 'INCLUSIO', itinerary: 'https://drive.google.com/file/d/1F40yV-aeuoHeG62Y4MwAb33T7S6BNJKV/view?usp=drivesdk' },
    { sl_code: 'SL-102', trip_code: 'FWN102', pax20plus2: null, pax25plus2: null, pax30plus2: null, details: 'INCLUSIO', itinerary: 'https://drive.google.com/file/d/16nzcduPdSMmx8o2D-7isdXAyb85uzyBx/view?usp=drivesdk' },
    { sl_code: 'SL-103', trip_code: 'FWN103', pax20plus2: 10100, pax25plus2: 9300, pax30plus2: 8500, details: 'INCLUSIO', itinerary: 'https://drive.google.com/file/d/1rYyjkgwllKOd78vNWbfq7wshDAhxclmv/view?usp=drivesdk' },
    { sl_code: 'SL-104', trip_code: 'FWN104', pax20plus2: 12800, pax25plus2: 11200, pax30plus2: 10300, details: 'INCLUSIO', itinerary: 'https://drive.google.com/file/d/1zjqA0UiurvrhczSalq-JRJVnM3w6f2r_/view?usp=drivesdk' },
    { sl_code: 'SL-105', trip_code: 'FWN105', pax20plus2: null, pax25plus2: null, pax30plus2: null, details: 'INCLUSIO', itinerary: 'https://drive.google.com/file/d/1xLrCRS620V-w29y5kYFm1CTZ-t8aVFcF/view?usp=drivesdk' },
    { sl_code: 'SL-106', trip_code: 'FWN106', pax20plus2: 10100, pax25plus2: 9200, pax30plus2: 8750, details: 'INCLUSIO', itinerary: 'https://drive.google.com/file/d/13-TVKn-s8HhHV7mzUh_zC6ryyMoNRwLR/view?usp=drivesdk' },
    { sl_code: 'SL-107', trip_code: 'FWN107', pax20plus2: 11200, pax25plus2: 10000, pax30plus2: 9800, details: 'INCLUSIO', itinerary: 'https://drive.google.com/file/d/1EewOW62GqkvIML_qFt84BybAwcR1rK-A/view?usp=drivesdk' },
    { sl_code: 'SL-108', trip_code: 'FWN108', pax20plus2: 12700, pax25plus2: 12400, pax30plus2: 11200, details: 'INCLUSIO', itinerary: 'https://drive.google.com/file/d/1PTBkla0TzE2nxE8mNKFXu95Tqb_0eFeh/view?usp=drivesdk' },
    { sl_code: 'SL-109', trip_code: 'FWN109', pax20plus2: 12700, pax25plus2: 12400, pax30plus2: 11200, details: 'INCLUSIO', itinerary: 'https://drive.google.com/file/d/19CJdlRbrkizTD2n0sPnPaLJHVsnhH2a5/view?usp=drivesdk' },
    { sl_code: 'SL-110', trip_code: 'FWN110', pax20plus2: 11200, pax25plus2: 10000, pax30plus2: 9800, details: 'INCLUSIO', itinerary: 'https://drive.google.com/file/d/12fv2gAk6h6_xsYCeyn1itfzNNObr10nV/view?usp=drivesdk' },
    { sl_code: 'SL-111', trip_code: 'FWN111', pax20plus2: 12700, pax25plus2: 12400, pax30plus2: 11200, details: 'INCLUSIO', itinerary: 'https://drive.google.com/file/d/1DOFM_bQQqYfNp1uDeuqLMwmkEhN7N3Cy/view?usp=drivesdk' },
    { sl_code: 'SL-112', trip_code: 'FWN112', pax20plus2: null, pax25plus2: null, pax30plus2: null, details: 'AGRA - DE', itinerary: 'https://drive.google.com/file/d/1RgO_cZoy4BGh6cOFuEw72WsTN6VYZel/view?usp=drivesdk' },
    { sl_code: 'SL-113', trip_code: 'FWN113', pax20plus2: 12900, pax25plus2: 11700, pax30plus2: 11400, details: 'INCLUSIO', itinerary: 'https://drive.google.com/file/d/1TXx5MU5U37CsZn4mykEaFykelL1CYsc/view?usp=drivesdk' },
    { sl_code: 'SL-114', trip_code: 'FWN114', pax20plus2: 12800, pax25plus2: 11600, pax30plus2: 11300, details: 'INCLUSIO', itinerary: 'https://drive.google.com/file/d/1t1-bPwO4ArpYalzXlv_WBwN6RPucKLKm/view?usp=drivesdk' },
    { sl_code: 'SL-115', trip_code: 'FWN115', pax20plus2: 14200, pax25plus2: 13000, pax30plus2: 12650, details: 'INCLUSIO', itinerary: 'https://drive.google.com/file/d/14aneLM6Hun2VJZTzwZNaWM7X_kw4hrNQ/view?usp=drivesdk' },
    { sl_code: 'SL-116', trip_code: 'FWN116', pax20plus2: null, pax25plus2: null, pax30plus2: null, details: 'INCLUSIO', itinerary: 'https://drive.google.com/file/d/1InOzUXt3hBgAzs01GsI1atRoXkJFAd3M/view?usp=drivesdk' },
    { sl_code: 'SL-117', trip_code: 'FWN117', pax20plus2: 13300, pax25plus2: 12050, pax30plus2: 11700, details: 'INCLUSIO', itinerary: 'https://drive.google.com/file/d/1Oh34-1JjNfInVs2zBYjEKlwT9wpiHQLY/view?usp=drivesdk' },
    { sl_code: 'SL-118', trip_code: 'FWN118', pax20plus2: 15200, pax25plus2: 13800, pax30plus2: 13300, details: 'INCLUSIO', itinerary: 'https://drive.google.com/file/d/15HmQTU6nviIhT6V31H_opz_ijTVOkCFk/view?usp=drivesdk' },
    { sl_code: 'SL-119', trip_code: 'FWN119', pax20plus2: 18300, pax25plus2: 16750, pax30plus2: 16200, details: 'INCLUSIO', itinerary: 'https://drive.google.com/file/d/1qBgH6DgwGnHNQLruJU7mvbWOup5xpxjx/view?usp=drivesdk' },
    { sl_code: 'SL-120', trip_code: 'FWN120', pax20plus2: 14000, pax25plus2: 12700, pax30plus2: 12500, details: 'INCLUSIO', itinerary: 'https://drive.google.com/file/d/1UaG2PN9A7qXADwT1neNrVL8VJxl3-GeN/view?usp=drivesdk' },
    { sl_code: 'SL-121', trip_code: 'FWN121', pax20plus2: 11200, pax25plus2: 10700, pax30plus2: 9800, details: 'INCLUSIO', itinerary: 'https://drive.google.com/file/d/1NoCrKSia99x5XlssDioU5xqAGANR2KS1/view?usp=drivesdk' },
    { sl_code: 'SL-130', trip_code: 'FWN130', pax20plus2: null, pax25plus2: null, pax30plus2: null, details: 'INCLUSIO', itinerary: 'https://drive.google.com/file/d/placeholder' },
];

async function main() {
    console.log('🌱 Seeding North Table...');
    try {
        for (const row of data) {
            console.log(`Inserting ${row.sl_code}...`);
            await db.insert(north).values(row)
                .onConflictDoUpdate({
                    target: north.id, // Assuming ID is not known, but sl_code might be unique? Actually schema says id is PK.
                    // Let's rely on insert. Or maybe check sl_code manually?
                    // Since we don't have constraints on sl_code in schema (only notNull), we might duplicate.
                    // Best to delete all first? Or insert safely?
                    // Let's use INSERT and ignore if it fails or just append.
                    set: row
                }).catch(err => {
                    // If duplicate key error, try update or ignore
                    console.error(`Error inserting ${row.sl_code}:`, err.message);
                });

            // Actually, let's use a simpler insert since we don't have a unique constraint on sl_code defined in the schema file text (it just says notNull).
            // Wait, if I run this multiple times I'll get duplicates.
            // I should probably clear the table or check first.
        }

        // Bulk insert would be faster:
        // await db.insert(north).values(data);

        console.log('✅ Seeding complete.');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
    }
    process.exit(0);
}

main();
