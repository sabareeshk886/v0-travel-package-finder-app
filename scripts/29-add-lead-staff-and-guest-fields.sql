-- Add no_of_staff and lead_guest_name fields to leads table

ALTER TABLE leads
ADD COLUMN IF NOT EXISTS no_of_staff INTEGER,
ADD COLUMN IF NOT EXISTS lead_guest_name TEXT;

COMMENT ON COLUMN leads.no_of_staff IS 'Number of staff members';
COMMENT ON COLUMN leads.lead_guest_name IS 'Name of the lead guest/primary contact';
