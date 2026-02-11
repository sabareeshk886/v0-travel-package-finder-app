-- ========================================
-- DATA INSERTION TEMPLATE
-- ========================================
-- Copy this file and rename it to 'data-to-insert.sql'
-- Replace the sample data with your actual data
-- Then run: npx tsx scripts/bulk-insert-from-sql.ts

-- ========================================
-- B2BINTERNATIONAL TABLE
-- ========================================

INSERT INTO b2binternational (
    sl_code, trip_code, details, itinerary,
    "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15",
    "20+2", "25+2", "30+2", "35+2", "40+2", "45+2", "50+2"
) VALUES 
('INTL001', 'EUROPE5N', 'Europe 5 Nights Tour', 
'Day 1: Paris\nDay 2: Rome\nDay 3: Amsterdam\nDay 4: Brussels\nDay 5: London\nDay 6: Departure',
95000, 85000, 78000, 72000, 68000, 65000, 62000, 60000, 58000, 56000, 54000, 52000, 50000, 48000,
45000, 43000, 41000, 39000, 37000, 35000, 33000);

-- Add more international packages below:
-- INSERT INTO b2binternational (...) VALUES (...);


-- ========================================
-- B2BNORTHEAST TABLE
-- ========================================

INSERT INTO b2bnortheast (
    sl_code, trip_code, details, itinerary,
    "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15",
    "20+2", "25+2", "30+2", "35+2", "40+2", "45+2", "50+2"
) VALUES 
('NE001', 'SIKKIM6N', 'Sikkim Darjeeling 6N Package',
'Day 1: Bagdogra to Gangtok\nDay 2: Local Gangtok\nDay 3: Lachen\nDay 4: Lachung\nDay 5: Darjeeling\nDay 6: Departure',
28000, 24000, 21000, 19000, 17500, 16500, 15500, 14800, 14200, 13800, 13400, 13000, 12700, 12400,
11500, 11000, 10500, 10200, 10000, 9800, 9500);

-- Add more northeast packages below:
-- INSERT INTO b2bnortheast (...) VALUES (...);


-- ========================================
-- B2BSOUTH TABLE
-- ========================================

INSERT INTO b2bsouth (
    sl_code, trip_code, details, itinerary,
    "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15",
    "20+2", "25+2", "30+2", "35+2", "40+2", "45+2", "50+2"
) VALUES 
('SOUTH001', 'KERALA5N', 'Kerala Backwaters 5N Tour',
'Day 1: Cochin to Munnar\nDay 2: Munnar\nDay 3: Thekkady\nDay 4: Alleppey\nDay 5: Cochin\nDay 6: Departure',
32000, 27000, 24000, 22000, 20500, 19500, 18500, 17800, 17200, 16800, 16400, 16000, 15700, 15400,
14500, 14000, 13500, 13200, 13000, 12800, 12500);

-- Add more south packages below:
-- INSERT INTO b2bsouth (...) VALUES (...);


-- ========================================
-- B2BNORTH TABLE
-- ========================================

INSERT INTO b2bnorth (
    sl_code, trip_code, details, itinerary,
    "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15",
    "20+2", "25+2", "30+2", "35+2", "40+2", "45+2", "50+2"
) VALUES 
('NORTH001', 'HIMACHAL7N', 'Himachal 7N Complete Tour',
'Day 1: Delhi to Shimla\nDay 2: Shimla\nDay 3: Shimla to Manali\nDay 4: Solang\nDay 5: Manali\nDay 6: Dharamshala\nDay 7: Mcleodganj\nDay 8: Departure',
35000, 30000, 26500, 24000, 22500, 21000, 19800, 18900, 18200, 17600, 17100, 16700, 16300, 16000,
15000, 14500, 14000, 13700, 13500, 13300, 13000);

-- Add more north packages below:
-- INSERT INTO b2bnorth (...) VALUES (...);


-- ========================================
-- B2BKASHMIR TABLE
-- ========================================

INSERT INTO b2bkashmir (
    sl_code, trip_code, details, itinerary,
    pax_02_std, pax_02_dlx, pax_02_prm,
    pax_03_std, pax_03_dlx, pax_03_prm,
    pax_04_std, pax_04_dlx, pax_04_prm,
    pax_05_std, pax_05_dlx, pax_05_prm,
    pax_06_std, pax_06_dlx, pax_06_prm,
    pax_07_std, pax_07_dlx, pax_07_prm,
    pax_08_std, pax_08_dlx, pax_08_prm,
    pax_09_std, pax_09_dlx, pax_09_prm,
    pax_10_std, pax_10_dlx, pax_10_prm,
    pax_12_std, pax_12_dlx, pax_12_prm,
    pax_15_std, pax_15_dlx, pax_15_prm,
    seasonal_std, seasonal_dlx, seasonal_prm
) VALUES 
('KSH001', 'KASHMIR6N', 'Kashmir Paradise 6N Package',
'Day 1: Srinagar Arrival\nDay 2: Sonamarg\nDay 3: Gulmarg\nDay 4: Pahalgam\nDay 5: Betaab Valley\nDay 6: Srinagar\nDay 7: Departure',
'28000', '35000', '42000',  -- Pax 2
'25000', '32000', '39000',  -- Pax 3
'23000', '30000', '37000',  -- Pax 4
'21500', '28500', '35500',  -- Pax 5
'20500', '27500', '34500',  -- Pax 6
'19800', '26800', '33800',  -- Pax 7
'19200', '26200', '33200',  -- Pax 8
'18700', '25700', '32700',  -- Pax 9
'18200', '25200', '32200',  -- Pax 10
'17500', '24500', '31500',  -- Pax 12
'16800', '23800', '30800',  -- Pax 15
'22000', '29000', '36000'); -- Seasonal

-- Add more Kashmir packages below:
-- INSERT INTO b2bkashmir (...) VALUES (...);
