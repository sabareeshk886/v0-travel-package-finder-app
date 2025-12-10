-- Simplify hotel room configs to have all pricing in one table
-- Remove the need for separate rate list

-- Add all meal plan rate columns to hotel_room_configs
ALTER TABLE hotel_room_configs
ADD COLUMN IF NOT EXISTS ep_room_rate NUMERIC,
ADD COLUMN IF NOT EXISTS room_in_cp NUMERIC,
ADD COLUMN IF NOT EXISTS room_in_map NUMERIC,
ADD COLUMN IF NOT EXISTS room_in_ap NUMERIC,
ADD COLUMN IF NOT EXISTS child_6_12_withoutbed_cp NUMERIC,
ADD COLUMN IF NOT EXISTS child_6_12_withbed_cp NUMERIC,
ADD COLUMN IF NOT EXISTS child_6_12_withoutbed_map NUMERIC,
ADD COLUMN IF NOT EXISTS child_6_12_withbed_map NUMERIC,
ADD COLUMN IF NOT EXISTS adult_above_12_cp NUMERIC,
ADD COLUMN IF NOT EXISTS adult_above_12_map NUMERIC;

-- Drop old columns that are no longer needed
ALTER TABLE hotel_room_configs
DROP COLUMN IF EXISTS meal_plan,
DROP COLUMN IF EXISTS price_per_night,
DROP COLUMN IF EXISTS child_6_12_without_bed_rate,
DROP COLUMN IF EXISTS child_6_12_with_bed_rate,
DROP COLUMN IF EXISTS adult_above_12_rate,
DROP COLUMN IF EXISTS child_policy,
DROP COLUMN IF EXISTS hotel_id,
DROP COLUMN IF EXISTS status;

-- Ensure vendor_id column exists
ALTER TABLE hotel_room_configs
ADD COLUMN IF NOT EXISTS vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE;

-- Update the foreign key if hotel_id still exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'hotel_room_configs' AND column_name = 'hotel_id'
  ) THEN
    ALTER TABLE hotel_room_configs DROP CONSTRAINT IF EXISTS hotel_room_configs_hotel_id_fkey;
  END IF;
END $$;

COMMENT ON TABLE hotel_room_configs IS 'Simplified hotel room configurations with all meal plan pricing in one table';
