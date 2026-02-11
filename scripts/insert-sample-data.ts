import { db } from '../lib/db';
import { b2binternational, b2bnortheast, b2bsouth, b2bnorth, b2bkashmir } from '../lib/b2b-schema';

/**
 * Template script for inserting data into B2B tables
 * Modify the sample data below with your actual data
 */

async function insertSampleData() {
    console.log('📝 Inserting sample data...\n');

    try {
        // ========================================
        // INSERT INTO B2BINTERNATIONAL
        // ========================================
        console.log('Inserting into b2binternational...');
        await db.insert(b2binternational).values([
            {
                sl_code: 'INTL001',
                trip_code: 'EUROPE5N',
                details: 'Amazing 5 Nights Europe Tour covering Paris, Rome and Amsterdam',
                itinerary: `Day 1: Arrival in Paris - Eiffel Tower
Day 2: Paris - Louvre Museum, Arc de Triomphe
Day 3: Travel to Rome - Colosseum
Day 4: Rome - Vatican City
Day 5: Amsterdam - Canal Cruise
Day 6: Departure`,
                2: 95000,
                3: 85000,
                4: 78000,
                5: 72000,
                6: 68000,
                7: 65000,
                8: 62000,
                9: 60000,
                10: 58000,
                11: 56000,
                12: 54000,
                13: 52000,
                14: 50000,
                15: 48000,
                '20+2': 45000,
                '25+2': 43000,
                '30+2': 41000,
                '35+2': 39000,
                '40+2': 37000,
                '45+2': 35000,
                '50+2': 33000,
            },
            // Add more international packages here
        ]);
        console.log('✅ b2binternational data inserted\n');

        // ========================================
        // INSERT INTO B2BNORTHEAST
        // ========================================
        console.log('Inserting into b2bnortheast...');
        await db.insert(b2bnortheast).values([
            {
                sl_code: 'NE001',
                trip_code: 'SIKKIM6N',
                details: 'Beautiful Sikkim and Darjeeling 6 Nights Package',
                itinerary: `Day 1: Bagdogra to Gangtok
Day 2: Gangtok Local Sightseeing
Day 3: Gangtok to Lachen
Day 4: Lachen to Lachung via Gurudongmar Lake
Day 5: Yumthang Valley - Return to Gangtok
Day 6: Gangtok to Darjeeling
Day 7: Departure from Bagdogra`,
                2: 28000,
                3: 24000,
                4: 21000,
                5: 19000,
                6: 17500,
                7: 16500,
                8: 15500,
                9: 14800,
                10: 14200,
                11: 13800,
                12: 13400,
                13: 13000,
                14: 12700,
                15: 12400,
                '20+2': 11500,
                '25+2': 11000,
                '30+2': 10500,
                '35+2': 10200,
                '40+2': 10000,
                '45+2': 9800,
                '50+2': 9500,
            },
            // Add more northeast packages here
        ]);
        console.log('✅ b2bnortheast data inserted\n');

        // ========================================
        // INSERT INTO B2BSOUTH
        // ========================================
        console.log('Inserting into b2bsouth...');
        await db.insert(b2bsouth).values([
            {
                sl_code: 'SOUTH001',
                trip_code: 'KERALA5N',
                details: 'Kerala Backwaters and Hill Station 5 Nights Tour',
                itinerary: `Day 1: Arrival Cochin - Transfer to Munnar
Day 2: Munnar Sightseeing
Day 3: Munnar to Thekkady
Day 4: Thekkady to Alleppey Houseboat
Day 5: Alleppey to Cochin
Day 6: Departure`,
                2: 32000,
                3: 27000,
                4: 24000,
                5: 22000,
                6: 20500,
                7: 19500,
                8: 18500,
                9: 17800,
                10: 17200,
                11: 16800,
                12: 16400,
                13: 16000,
                14: 15700,
                15: 15400,
                '20+2': 14500,
                '25+2': 14000,
                '30+2': 13500,
                '35+2': 13200,
                '40+2': 13000,
                '45+2': 12800,
                '50+2': 12500,
            },
            // Add more south packages here
        ]);
        console.log('✅ b2bsouth data inserted\n');

        // ========================================
        // INSERT INTO B2BNORTH
        // ========================================
        console.log('Inserting into b2bnorth...');
        await db.insert(b2bnorth).values([
            {
                sl_code: 'NORTH001',
                trip_code: 'HIMACHAL7N',
                details: 'Himachal Pradesh 7 Nights Complete Tour',
                itinerary: `Day 1: Delhi to Shimla
Day 2: Shimla Local Sightseeing
Day 3: Shimla to Manali
Day 4: Manali to Solang Valley
Day 5: Manali Local - Hadimba Temple, Vashisht
Day 6: Manali to Dharamshala
Day 7: Dharamshala - Mcleodganj
Day 8: Departure to Delhi`,
                2: 35000,
                3: 30000,
                4: 26500,
                5: 24000,
                6: 22500,
                7: 21000,
                8: 19800,
                9: 18900,
                10: 18200,
                11: 17600,
                12: 17100,
                13: 16700,
                14: 16300,
                15: 16000,
                '20+2': 15000,
                '25+2': 14500,
                '30+2': 14000,
                '35+2': 13700,
                '40+2': 13500,
                '45+2': 13300,
                '50+2': 13000,
            },
            // Add more north packages here
        ]);
        console.log('✅ b2bnorth data inserted\n');

        // ========================================
        // INSERT INTO B2BKASHMIR
        // ========================================
        console.log('Inserting into b2bkashmir...');
        await db.insert(b2bkashmir).values([
            {
                sl_code: 'KSH001',
                trip_code: 'KASHMIR6N',
                details: 'Kashmir Paradise 6 Nights Package - Srinagar, Gulmarg, Pahalgam',
                itinerary: `Day 1: Arrival Srinagar - Shikara Ride
Day 2: Srinagar to Sonamarg Day Trip
Day 3: Srinagar to Gulmarg - Gondola Ride
Day 4: Gulmarg to Pahalgam
Day 5: Pahalgam - Betaab Valley, Aru Valley
Day 6: Pahalgam to Srinagar
Day 7: Departure`,
                pax_02_std: '28000',
                pax_02_dlx: '35000',
                pax_02_prm: '42000',
                pax_03_std: '25000',
                pax_03_dlx: '32000',
                pax_03_prm: '39000',
                pax_04_std: '23000',
                pax_04_dlx: '30000',
                pax_04_prm: '37000',
                pax_05_std: '21500',
                pax_05_dlx: '28500',
                pax_05_prm: '35500',
                pax_06_std: '20500',
                pax_06_dlx: '27500',
                pax_06_prm: '34500',
                pax_07_std: '19800',
                pax_07_dlx: '26800',
                pax_07_prm: '33800',
                pax_08_std: '19200',
                pax_08_dlx: '26200',
                pax_08_prm: '33200',
                pax_09_std: '18700',
                pax_09_dlx: '25700',
                pax_09_prm: '32700',
                pax_10_std: '18200',
                pax_10_dlx: '25200',
                pax_10_prm: '32200',
                pax_12_std: '17500',
                pax_12_dlx: '24500',
                pax_12_prm: '31500',
                pax_15_std: '16800',
                pax_15_dlx: '23800',
                pax_15_prm: '30800',
                seasonal_std: '22000',
                seasonal_dlx: '29000',
                seasonal_prm: '36000',
            },
            // Add more Kashmir packages here
        ]);
        console.log('✅ b2bkashmir data inserted\n');

        console.log('════════════════════════════════════════');
        console.log('✅ All sample data inserted successfully!');
        console.log('════════════════════════════════════════\n');
        console.log('Run: npx tsx scripts/verify-neon-data.ts to verify');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error inserting data:', error);
        process.exit(1);
    }
}

insertSampleData();
