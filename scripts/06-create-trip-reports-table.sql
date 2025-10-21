-- Create trip_reports table for storing trip report submissions
CREATE TABLE IF NOT EXISTS trip_reports (
  id BIGSERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  pickup_date DATE NOT NULL,
  dropoff_date DATE NOT NULL,
  pickup_point TEXT NOT NULL,
  destination TEXT NOT NULL,
  no_of_days INTEGER NOT NULL,
  bus_details TEXT,
  driver_name TEXT,
  companion TEXT,
  per_head NUMERIC(10, 2) NOT NULL,
  no_of_pax INTEGER NOT NULL,
  free_of_cost NUMERIC(10, 2) DEFAULT 0,
  total NUMERIC(10, 2) DEFAULT 0,
  -- Replaced discount_1 and discount_2 with single discount field
  discount NUMERIC(10, 2) DEFAULT 0,
  sales_by TEXT,
  coordinator TEXT,
  gst NUMERIC(10, 2) DEFAULT 0,
  additional_income NUMERIC(10, 2) DEFAULT 0,
  advance_paid NUMERIC(10, 2) DEFAULT 0,
  lead_type TEXT DEFAULT 'company',
  companion_fund NUMERIC(10, 2) DEFAULT 0,
  -- Calculated financial fields
  total_cash NUMERIC(10, 2) DEFAULT 0,
  expenses JSONB DEFAULT '[]'::jsonb,
  total_expenses NUMERIC(10, 2) DEFAULT 0,
  balance NUMERIC(10, 2) DEFAULT 0,
  incentive NUMERIC(10, 2) DEFAULT 0,
  final_profit NUMERIC(10, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS for trip_reports table (internal tool)
ALTER TABLE trip_reports DISABLE ROW LEVEL SECURITY;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_trip_reports_pickup_date ON trip_reports(pickup_date);
CREATE INDEX IF NOT EXISTS idx_trip_reports_customer_name ON trip_reports(customer_name);
