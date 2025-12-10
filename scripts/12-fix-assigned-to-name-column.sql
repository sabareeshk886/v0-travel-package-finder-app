-- Fix assigned_to_name column to be TEXT instead of UUID
-- This allows storing staff names directly (ANEES, OFFICE, NIYAS, etc.)

-- Drop the existing column and recreate it as TEXT
ALTER TABLE leads DROP COLUMN IF EXISTS assigned_to_name;
ALTER TABLE leads ADD COLUMN assigned_to_name TEXT;

-- Create index for better performance on queries filtering by assigned_to_name
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to_name ON leads(assigned_to_name);

-- Update any null created_by to a default UUID to prevent foreign key issues
-- Or make created_by nullable if you don't want to track who created the lead
ALTER TABLE leads ALTER COLUMN created_by DROP NOT NULL;
