-- Create trip_room_bookings table
CREATE TABLE IF NOT EXISTS trip_room_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  place TEXT,
  property_name TEXT,
  no_of_rooms INTEGER,
  check_in_date DATE,
  check_out_date DATE,
  description TEXT,
  booking_confirmed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS
ALTER TABLE trip_room_bookings DISABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_trip_room_bookings_trip_id ON trip_room_bookings(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_room_bookings_check_in ON trip_room_bookings(check_in_date);

-- Trigger for updated_at
CREATE TRIGGER update_trip_room_bookings_updated_at BEFORE UPDATE ON trip_room_bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
