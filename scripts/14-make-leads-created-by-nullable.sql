-- Make created_by nullable in leads table to allow lead creation without user IDs

-- Check if created_by column exists before modifying it
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE leads ALTER COLUMN created_by DROP NOT NULL;
  END IF;
END $$;
