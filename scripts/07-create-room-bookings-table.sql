-- Create room_bookings table
CREATE TABLE IF NOT EXISTS room_bookings (
  id BIGSERIAL PRIMARY KEY,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  place TEXT NOT NULL,
  no_of_adults INTEGER NOT NULL,
  no_of_kids INTEGER DEFAULT 0,
  property_name TEXT NOT NULL,
  sales_by TEXT NOT NULL,
  selling_rate DECIMAL(10, 2) NOT NULL,
  b2b_rate DECIMAL(10, 2) NOT NULL,
  profit DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS for room_bookings table
ALTER TABLE room_bookings DISABLE ROW LEVEL SECURITY;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_room_bookings_check_in ON room_bookings(check_in_date);
CREATE INDEX IF NOT EXISTS idx_room_bookings_created_at ON room_bookings(created_at DESC);
