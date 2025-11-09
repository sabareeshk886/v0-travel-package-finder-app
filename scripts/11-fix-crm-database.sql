-- Fix CRM Database Schema
-- This script adds missing columns and tables to make the CRM fully functional

-- 1. Add assigned_to_name column to leads table
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS assigned_to_name TEXT;

-- Make created_by nullable for leads
ALTER TABLE leads 
ALTER COLUMN created_by DROP NOT NULL;

-- 2. Create expenses table if it doesn't exist
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_date DATE NOT NULL,
  trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
  vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  payment_mode TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'paid',
  notes TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for expenses table
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_trip ON expenses(trip_id);
CREATE INDEX IF NOT EXISTS idx_expenses_vendor ON expenses(vendor_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);

-- Disable RLS on expenses table for now
ALTER TABLE expenses DISABLE ROW LEVEL SECURITY;

-- 3. Make created_by nullable for payments table
ALTER TABLE payments 
ALTER COLUMN created_by DROP NOT NULL;

-- Add index on assigned_to_name for leads
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to_name ON leads(assigned_to_name);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'CRM database schema updated successfully!';
  RAISE NOTICE '- Added assigned_to_name column to leads table';
  RAISE NOTICE '- Created expenses table';
  RAISE NOTICE '- Made created_by fields nullable';
END $$;
