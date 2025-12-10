-- Add all meal plan rate columns to hotel_room_configs table
-- This enables separate pricing for EP, CP, MAP, and AP meal plans
-- Plus specific child and adult rates for CP and MAP plans

ALTER TABLE hotel_room_configs
-- Add meal plan room rates
ADD COLUMN IF NOT EXISTS ep_room_rate NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS cp_room_rate NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS map_room_rate NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS ap_room_rate NUMERIC(10, 2),

-- Add CP meal plan specific child and adult rates
ADD COLUMN IF NOT EXISTS child_6_12_without_bed_cp NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS child_6_12_with_bed_cp NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS adult_above_12_cp NUMERIC(10, 2),

-- Add MAP meal plan specific child and adult rates
ADD COLUMN IF NOT EXISTS child_6_12_without_bed_map NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS child_6_12_with_bed_map NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS adult_above_12_map NUMERIC(10, 2);

-- Remove old columns that are no longer needed
ALTER TABLE hotel_room_configs
DROP COLUMN IF EXISTS meal_plan,
DROP COLUMN IF EXISTS price_per_night,
DROP COLUMN IF EXISTS child_6_12_without_bed_rate,
DROP COLUMN IF EXISTS child_6_12_with_bed_rate,
DROP COLUMN IF EXISTS adult_above_12_rate;

-- Add comment explaining the structure
COMMENT ON TABLE hotel_room_configs IS 'Hotel room configurations with separate rates for each meal plan (EP, CP, MAP, AP) and specific child/adult rates for CP and MAP plans';
