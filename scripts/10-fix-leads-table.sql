-- Fix the leads table to make created_by optional and add assigned_to_name
ALTER TABLE leads ALTER COLUMN created_by DROP NOT NULL;

-- Add a simple text field for assigned_to_name instead of relying on users table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS assigned_to_name TEXT;

-- Update the check constraint for assigned_to_name
ALTER TABLE leads ADD CONSTRAINT leads_assigned_to_name_check 
  CHECK (assigned_to_name IN ('ANEES', 'OFFICE', 'NIYAS', 'ARJUN', 'PRATHUSH', 'ANURANJ') OR assigned_to_name IS NULL);
