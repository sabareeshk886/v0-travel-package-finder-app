-- Make created_by nullable in leads table to allow lead creation without user IDs

ALTER TABLE leads 
ALTER COLUMN created_by DROP NOT NULL;

-- Also make assigned_to nullable
ALTER TABLE leads 
ALTER COLUMN assigned_to DROP NOT NULL;
