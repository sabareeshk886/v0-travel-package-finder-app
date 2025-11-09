-- Update vendors table to support comprehensive vendor management
-- Add hotel category rating field and update constraints

-- Add hotel_category column for hotels (2 Star, 3 Star, etc.)
ALTER TABLE vendors 
ADD COLUMN IF NOT EXISTS hotel_category TEXT;

-- Update the existing category values if needed
-- Ensure category uses proper names
DO $$ 
BEGIN
  -- Check if we need to add any constraints
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'vendors_category_check'
  ) THEN
    ALTER TABLE vendors
    ADD CONSTRAINT vendors_category_check 
    CHECK (category IN ('Hotel', 'Transportation', 'Restaurant', 'Guide', 'Activity Provider', 'Other'));
  END IF;
END $$;

-- Create index for faster category filtering
CREATE INDEX IF NOT EXISTS idx_vendors_category ON vendors(category);
CREATE INDEX IF NOT EXISTS idx_vendors_is_active ON vendors(is_active);
CREATE INDEX IF NOT EXISTS idx_vendors_hotel_category ON vendors(hotel_category) WHERE category = 'Hotel';

-- Add comment to explain hotel_category usage
COMMENT ON COLUMN vendors.hotel_category IS 'Hotel rating category: 2 Star, 3 Star, 4 Star, 5 Star, Resort, Homestay (only for Hotel category vendors)';
COMMENT ON COLUMN vendors.rating IS 'Numeric rating 1-5 for non-hotel vendors';

-- Update hotel_room_configs to link to vendors instead of separate hotels table
ALTER TABLE hotel_room_configs 
ADD COLUMN IF NOT EXISTS vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE;

-- Create index for room configs
CREATE INDEX IF NOT EXISTS idx_hotel_room_configs_vendor ON hotel_room_configs(vendor_id);

-- Add RLS policies for vendors
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to view active vendors
CREATE POLICY IF NOT EXISTS "Allow read access to active vendors" 
ON vendors FOR SELECT 
USING (is_active = true);

-- Allow insert/update/delete for authenticated users (you can restrict this further)
CREATE POLICY IF NOT EXISTS "Allow full access to vendors" 
ON vendors FOR ALL 
USING (true);

-- Add RLS for hotel room configs
ALTER TABLE hotel_room_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow read access to room configs" 
ON hotel_room_configs FOR SELECT 
USING (true);

CREATE POLICY IF NOT EXISTS "Allow full access to room configs" 
ON hotel_room_configs FOR ALL 
USING (true);
