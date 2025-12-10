-- Fix CRM Database Schema
-- This script adds missing columns and tables to make the CRM fully functional

-- 1. Add assigned_to_name column to leads table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'assigned_to_name'
  ) THEN
    ALTER TABLE leads ADD COLUMN assigned_to_name TEXT;
  END IF;
END $$;

-- Make created_by nullable for leads if column exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE leads ALTER COLUMN created_by DROP NOT NULL;
  END IF;
END $$;

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
  expense_number TEXT,
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

-- Add index on assigned_to_name for leads if column exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'assigned_to_name'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_leads_assigned_to_name ON leads(assigned_to_name);
  END IF;
END $$;
