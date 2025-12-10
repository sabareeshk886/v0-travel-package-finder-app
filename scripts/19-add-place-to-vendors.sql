-- Add place column to vendors table
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS place TEXT;

-- Add comment for documentation
COMMENT ON COLUMN vendors.place IS 'Location/Place where vendor is located';
