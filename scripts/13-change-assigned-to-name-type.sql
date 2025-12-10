-- Change assigned_to_name column from UUID to TEXT
-- This allows storing staff names directly like "ANEES", "OFFICE", "NIYAS", etc.

ALTER TABLE public.leads 
ALTER COLUMN assigned_to_name TYPE TEXT USING assigned_to_name::TEXT;

-- Update any NULL values to empty string if needed
UPDATE public.leads 
SET assigned_to_name = '' 
WHERE assigned_to_name IS NULL;
