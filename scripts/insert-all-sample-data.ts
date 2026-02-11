import { db } from '../lib/db';
import { south, north, northeast, international, kashmir } from '../lib/schema';
import { b2binternational, b2bnortheast, b2bsouth, b2bnorth, b2bkashmir } from '../lib/b2b-schema';

/**
 * Template script for inserting data into ALL regional tables (Regular + B2B)
 * Modify the sample data below with your actual data
 */

async function insertAllSampleData() {
    console.log('📝 Inserting sample data into ALL tables...\n');

    try {
        // ========================================
        // REGULAR REGIONAL TABLES
        // ========================================

        console.log('═══ REGULAR REGIONAL TABLES ═══\n');

        // ========================================
        // INSERT INTO SOUTH
        // ========================================
        console.log('Inserting into south...');
        await db.insert(south).values([
            {
                sl_code: 'SOUTH001',
                trip_code: 'KERALA5N',
                details: 'Kerala Backwaters and Hill Station 5 Nights Tour',
                itinerary: `Day 1: Arrival Cochin - Transfer to Munnar
Day 2: Munnar Sightseeing - Tea Gardens, Echo Point
Day 3: Munnar to Thekkady - Spice Plantations
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
        console.log('✅ south data inserted\n');

        // ========================================
        // INSERT INTO NORTH
        // ========================================
        console.log('Inserting into north...');
        await db.insert(north).values([
            {
                sl_code: 'NORTH001',
                trip_code: 'HIMACHAL7N',
                details: 'Himachal Pradesh 7 Nights Complete Tour',
                itinerary: `Day 1: Delhi to Shimla
Day 2: Shimla Local - Mall Road, Ridge, Jakhu Temple
Day 3: Shimla to Manali via Kullu Valley
Day 4: Manali to Solang Valley - Snow Activities
Day 5: Manali Local - Hadimba Temple, Vashisht
Day 6: Manali to Dharamshala
Day 7: Dharamshala - Mcleodganj, Dalai Lama Temple
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
        console.log('✅ north data inserted\n');

        // ========================================
        // INSERT INTO NORTHEAST
        // ========================================
        console.log('Inserting into northeast...');
        await db.insert(northeast).values([
            {
                sl_code: 'NE001',
                trip_code: 'SIKKIM6N',
                details: 'Beautiful Sikkim and Darjeeling 6 Nights Package',
                itinerary: `Day 1: Bagdogra to Gangtok (124 km, 4 hrs)
Day 2: Gangtok Local - MG Marg, Enchey Monastery
Day 3: Gangtok to Lachen via Chungthang
Day 4: Lachen to Lachung via Gurudongmar Lake
Day 5: Yumthang Valley - Zero Point - Return to Gangtok
Day 6: Gangtok to Darjeeling
Day 7: Tiger Hill Sunrise - Departure from Bagdogra`,
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
        console.log('✅ northeast data inserted\n');

        // ========================================
        // INSERT INTO INTERNATIONAL
        // ========================================
        console.log('Inserting into international...');
        await db.insert(international).values([
            {
                sl_code: 'INTL001',
                trip_code: 'EUROPE5N',
                details: 'Amazing 5 Nights Europe Tour covering Paris, Rome and Amsterdam',
                itinerary: `Day 1: Arrival in Paris - Eiffel Tower, Seine River Cruise
Day 2: Paris - Louvre Museum, Arc de Triomphe, Champs-Élysées
Day 3: Travel to Rome - Colosseum, Roman Forum
Day 4: Rome - Vatican City, Sistine Chapel, St. Peter's Basilica
Day 5: Amsterdam - Canal Cruise, Anne Frank House
Day 6: Amsterdam - Keukenhof Gardens (seasonal), Windmills
Day 7: Departure`,
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
        console.log('✅ international data inserted\n');

        // ========================================
        // INSERT INTO KASHMIR
        // ========================================
        console.log('Inserting into kashmir...');
        await db.insert(kashmir).values([
            {
                sl_code: 'KSH001',
                trip_code: 'KASHMIR6N',
                details: 'Kashmir Paradise 6 Nights Package - Srinagar, Gulmarg, Pahalgam',
                itinerary: `Day 1: Arrival Srinagar - Dal Lake Shikara Ride
Day 2: Srinagar to Sonamarg Day Trip - Thajiwas Glacier
Day 3: Srinagar to Gulmarg - Gondola Ride (Phase 1 & 2)
Day 4: Gulmarg to Pahalgam via Srinagar
Day 5: Pahalgam - Betaab Valley, Aru Valley, Chandanwari
Day 6: Pahalgam to Srinagar
Day 7: Departure - Transfer to Airport`,
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
        console.log('✅ kashmir data inserted\n');

        // ========================================
        // B2B REGIONAL TABLES
        // ========================================

        console.log('\n═══ B2B REGIONAL TABLES ═══\n');

        // ========================================
        // INSERT INTO B2BSOUTH
        // ========================================
        console.log('Inserting into b2bsouth...');
        await db.insert(b2bsouth).values([
            {
                sl_code: 'B2B-S001',
                trip_code: 'B2BKERALA5N',
                details: 'B2B Kerala Package - Wholesale Rates',
                itinerary: `Day 1: Cochin - Munnar
Day 2: Munnar Sightseeing
Day 3: Thekkady
Day 4: Alleppey Houseboat
Day 5: Cochin Departure`,
                2: 28000,
                3: 24000,
                4: 21000,
                5: 19000,
                6: 18000,
                7: 17000,
                8: 16000,
                9: 15500,
                10: 15000,
                11: 14600,
                12: 14200,
                13: 13900,
                14: 13600,
                15: 13300,
                '20+2': 12500,
                '25+2': 12000,
                '30+2': 11500,
                '35+2': 11200,
                '40+2': 11000,
                '45+2': 10800,
                '50+2': 10500,
            },
        ]);
        console.log('✅ b2bsouth data inserted\n');

        // ========================================
        // INSERT INTO B2BNORTH
        // ========================================
        console.log('Inserting into b2bnorth...');
        await db.insert(b2bnorth).values([
            {
                sl_code: 'B2B-N001',
                trip_code: 'B2BHIMACHAL7N',
                details: 'B2B Himachal Package - Wholesale Rates',
                itinerary: `Day 1: Delhi - Shimla
Day 2: Shimla Local
Day 3: Shimla - Manali
Day 4: Solang Valley
Day 5: Manali Local
Day 6: Dharamshala
Day 7: Mcleodganj
Day 8: Delhi Departure`,
                2: 31000,
                3: 26500,
                4: 23500,
                5: 21500,
                6: 20000,
                7: 18800,
                8: 17700,
                9: 16900,
                10: 16300,
                11: 15800,
                12: 15300,
                13: 14900,
                14: 14600,
                15: 14300,
                '20+2': 13500,
                '25+2': 13000,
                '30+2': 12500,
                '35+2': 12200,
                '40+2': 12000,
                '45+2': 11800,
                '50+2': 11500,
            },
        ]);
        console.log('✅ b2bnorth data inserted\n');

        // Continue with other B2B tables as needed...

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

insertAllSampleData();
