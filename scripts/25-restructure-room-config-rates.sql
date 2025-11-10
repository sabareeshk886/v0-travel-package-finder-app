-- Restructure hotel_room_configs for separate CP and MAP child/adult rates

-- Drop old child/adult rate columns
ALTER TABLE hotel_room_configs
DROP COLUMN IF EXISTS child_6_12_without_bed_rate,
DROP COLUMN IF EXISTS child_6_12_with_bed_rate,
DROP COLUMN IF EXISTS adult_above_12_rate,
DROP COLUMN IF EXISTS price_per_night,
DROP COLUMN IF EXISTS meal_plan;

-- Fixed column names to match the code (ep_room_rate instead of ep_rate, etc.)
-- Add EP, CP, MAP, AP room rates
ALTER TABLE hotel_room_configs
ADD COLUMN IF NOT EXISTS ep_room_rate NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS cp_room_rate NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS map_room_rate NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS ap_room_rate NUMERIC(10, 2);

-- Add CP meal plan child/adult rates
ALTER TABLE hotel_room_configs
ADD COLUMN IF NOT EXISTS child_6_12_without_bed_cp NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS child_6_12_with_bed_cp NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS adult_above_12_cp NUMERIC(10, 2);

-- Add MAP meal plan child/adult rates
ALTER TABLE hotel_room_configs
ADD COLUMN IF NOT EXISTS child_6_12_without_bed_map NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS child_6_12_with_bed_map NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS adult_above_12_map NUMERIC(10, 2);

-- Add comment
COMMENT ON TABLE hotel_room_configs IS 'Hotel room configurations with separate rates for EP, CP, MAP, AP meal plans and meal-specific child/adult charges';
