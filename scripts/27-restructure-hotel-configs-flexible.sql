-- Remove all static rate columns from hotel_room_configs
-- Keep only basic room configuration fields

ALTER TABLE hotel_room_configs
DROP COLUMN IF EXISTS ep_room_rate,
DROP COLUMN IF EXISTS cp_room_rate,
DROP COLUMN IF EXISTS map_room_rate,
DROP COLUMN IF EXISTS ap_room_rate,
DROP COLUMN IF EXISTS child_6_12_without_bed_cp,
DROP COLUMN IF EXISTS child_6_12_with_bed_cp,
DROP COLUMN IF EXISTS adult_above_12_cp,
DROP COLUMN IF EXISTS child_6_12_without_bed_map,
DROP COLUMN IF EXISTS child_6_12_with_bed_map,
DROP COLUMN IF EXISTS adult_above_12_map,
DROP COLUMN IF EXISTS child_6_12_without_bed_rate,
DROP COLUMN IF EXISTS child_6_12_with_bed_rate,
DROP COLUMN IF EXISTS adult_above_12_rate,
DROP COLUMN IF EXISTS meal_plan,
DROP COLUMN IF EXISTS price_per_night,
DROP COLUMN IF EXISTS hotel_id,
DROP COLUMN IF EXISTS child_policy;

-- Ensure vendor_id exists and is properly set up
ALTER TABLE hotel_room_configs
ADD COLUMN IF NOT EXISTS vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE;

-- Update hotel_room_rates to use vendor_id instead of hotel_id
ALTER TABLE hotel_room_rates
DROP COLUMN IF EXISTS hotel_id;

ALTER TABLE hotel_room_rates
ADD COLUMN IF NOT EXISTS vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_hotel_room_configs_vendor_id ON hotel_room_configs(vendor_id);
CREATE INDEX IF NOT EXISTS idx_hotel_room_rates_vendor_id ON hotel_room_rates(vendor_id);
CREATE INDEX IF NOT EXISTS idx_hotel_room_rates_category ON hotel_room_rates(category_name);
