-- Hotels Management System
-- This script creates tables for hotel and room configuration management

-- Hotels table
CREATE TABLE IF NOT EXISTS hotels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_name TEXT NOT NULL,
  location TEXT NOT NULL,
  contact_person TEXT,
  contact_number TEXT NOT NULL,
  email TEXT,
  hotel_category TEXT NOT NULL CHECK (hotel_category IN ('3 Star', '4 Star', '5 Star', 'Resort', 'Homestay', 'Budget', 'Luxury', 'Boutique', 'Other')),
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Room Configurations table
CREATE TABLE IF NOT EXISTS hotel_room_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
  room_category TEXT NOT NULL,
  room_sharing_type TEXT NOT NULL CHECK (room_sharing_type IN ('Single', 'Double', 'Triple', 'Quad')),
  meal_plan TEXT NOT NULL CHECK (meal_plan IN ('EP', 'CP', 'MAP', 'AP')),
  room_capacity INTEGER NOT NULL,
  price_per_night NUMERIC NOT NULL,
  extra_bed_price NUMERIC DEFAULT 0,
  child_policy TEXT,
  availability_status TEXT DEFAULT 'Available' CHECK (availability_status IN ('Available', 'Not Available')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_hotels_location ON hotels(location);
CREATE INDEX IF NOT EXISTS idx_hotels_category ON hotels(hotel_category);
CREATE INDEX IF NOT EXISTS idx_hotel_room_configs_hotel ON hotel_room_configs(hotel_id);
CREATE INDEX IF NOT EXISTS idx_hotel_room_configs_availability ON hotel_room_configs(availability_status);

-- Disable RLS
ALTER TABLE hotels DISABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_room_configs DISABLE ROW LEVEL SECURITY;

-- Create trigger for updated_at
CREATE TRIGGER update_hotels_updated_at BEFORE UPDATE ON hotels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hotel_room_configs_updated_at BEFORE UPDATE ON hotel_room_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
