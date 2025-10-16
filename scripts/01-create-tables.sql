-- Create South region table
CREATE TABLE IF NOT EXISTS south (
  id SERIAL PRIMARY KEY,
  sl_code TEXT NOT NULL,
  trip_code TEXT NOT NULL,
  "2" INTEGER,
  "3" INTEGER,
  "4" INTEGER,
  "5" INTEGER,
  "6" INTEGER,
  "7" INTEGER,
  "8" INTEGER,
  "9" INTEGER,
  "10" INTEGER,
  "11" INTEGER,
  "12" INTEGER,
  "13" INTEGER,
  "14" INTEGER,
  "15" INTEGER,
  "20+2" INTEGER,
  "25+2" INTEGER,
  "30+2" INTEGER,
  "35+2" INTEGER,
  "40+2" INTEGER,
  "45+2" INTEGER,
  "50+2" INTEGER,
  details TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create North region table
CREATE TABLE IF NOT EXISTS north (
  id SERIAL PRIMARY KEY,
  sl_code TEXT NOT NULL,
  trip_code TEXT NOT NULL,
  "2" INTEGER,
  "3" INTEGER,
  "4" INTEGER,
  "5" INTEGER,
  "6" INTEGER,
  "7" INTEGER,
  "8" INTEGER,
  "9" INTEGER,
  "10" INTEGER,
  "11" INTEGER,
  "12" INTEGER,
  "13" INTEGER,
  "14" INTEGER,
  "15" INTEGER,
  "20+2" INTEGER,
  "25+2" INTEGER,
  "30+2" INTEGER,
  "35+2" INTEGER,
  "40+2" INTEGER,
  "45+2" INTEGER,
  "50+2" INTEGER,
  details TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Kashmir region table
CREATE TABLE IF NOT EXISTS kashmir (
  id SERIAL PRIMARY KEY,
  sl_code TEXT NOT NULL,
  trip_code TEXT NOT NULL,
  "2" INTEGER,
  "3" INTEGER,
  "4" INTEGER,
  "5" INTEGER,
  "6" INTEGER,
  "7" INTEGER,
  "8" INTEGER,
  "9" INTEGER,
  "10" INTEGER,
  "11" INTEGER,
  "12" INTEGER,
  "13" INTEGER,
  "14" INTEGER,
  "15" INTEGER,
  "20+2" INTEGER,
  "25+2" INTEGER,
  "30+2" INTEGER,
  "35+2" INTEGER,
  "40+2" INTEGER,
  "45+2" INTEGER,
  "50+2" INTEGER,
  details TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Northeast region table
CREATE TABLE IF NOT EXISTS northeast (
  id SERIAL PRIMARY KEY,
  sl_code TEXT NOT NULL,
  trip_code TEXT NOT NULL,
  "2" INTEGER,
  "3" INTEGER,
  "4" INTEGER,
  "5" INTEGER,
  "6" INTEGER,
  "7" INTEGER,
  "8" INTEGER,
  "9" INTEGER,
  "10" INTEGER,
  "11" INTEGER,
  "12" INTEGER,
  "13" INTEGER,
  "14" INTEGER,
  "15" INTEGER,
  "20+2" INTEGER,
  "25+2" INTEGER,
  "30+2" INTEGER,
  "35+2" INTEGER,
  "40+2" INTEGER,
  "45+2" INTEGER,
  "50+2" INTEGER,
  details TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create International region table
CREATE TABLE IF NOT EXISTS international (
  id SERIAL PRIMARY KEY,
  sl_code TEXT NOT NULL,
  trip_code TEXT NOT NULL,
  "2" INTEGER,
  "3" INTEGER,
  "4" INTEGER,
  "5" INTEGER,
  "6" INTEGER,
  "7" INTEGER,
  "8" INTEGER,
  "9" INTEGER,
  "10" INTEGER,
  "11" INTEGER,
  "12" INTEGER,
  "13" INTEGER,
  "14" INTEGER,
  "15" INTEGER,
  "20+2" INTEGER,
  "25+2" INTEGER,
  "30+2" INTEGER,
  "35+2" INTEGER,
  "40+2" INTEGER,
  "45+2" INTEGER,
  "50+2" INTEGER,
  details TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_south_trip_code ON south(trip_code);
CREATE INDEX IF NOT EXISTS idx_north_trip_code ON north(trip_code);
CREATE INDEX IF NOT EXISTS idx_kashmir_trip_code ON kashmir(trip_code);
CREATE INDEX IF NOT EXISTS idx_northeast_trip_code ON northeast(trip_code);
CREATE INDEX IF NOT EXISTS idx_international_trip_code ON international(trip_code);
