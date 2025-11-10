-- Add separate meal plan rate columns to hotel_room_configs table
-- This script adds new columns for EP, CP, MAP, AP rates and child/adult rates for CP and MAP

ALTER TABLE hotel_room_configs
ADD COLUMN IF NOT EXISTS ep_room_rate NUMERIC,
ADD COLUMN IF NOT EXISTS cp_room_rate NUMERIC,
ADD COLUMN IF NOT EXISTS map_room_rate NUMERIC,
ADD COLUMN IF NOT EXISTS ap_room_rate NUMERIC,
ADD COLUMN IF NOT EXISTS child_6_12_without_bed_cp NUMERIC,
ADD COLUMN IF NOT EXISTS child_6_12_with_bed_cp NUMERIC,
ADD COLUMN IF NOT EXISTS adult_above_12_cp NUMERIC,
ADD COLUMN IF NOT EXISTS child_6_12_without_bed_map NUMERIC,
ADD COLUMN IF NOT EXISTS child_6_12_with_bed_map NUMERIC,
ADD COLUMN IF NOT EXISTS adult_above_12_map NUMERIC;

-- Add comment to explain the new structure
COMMENT ON COLUMN hotel_room_configs.ep_room_rate IS 'Room rate for EP (European Plan - Room Only) meal plan';
COMMENT ON COLUMN hotel_room_configs.cp_room_rate IS 'Room rate for CP (Continental Plan - Room + Breakfast) meal plan';
COMMENT ON COLUMN hotel_room_configs.map_room_rate IS 'Room rate for MAP (Modified American Plan - Room + Breakfast + Dinner) meal plan';
COMMENT ON COLUMN hotel_room_configs.ap_room_rate IS 'Room rate for AP (American Plan - Room + All Meals) meal plan';
COMMENT ON COLUMN hotel_room_configs.child_6_12_without_bed_cp IS 'Extra charge for child 6-12 years without bed on CP plan';
COMMENT ON COLUMN hotel_room_configs.child_6_12_with_bed_cp IS 'Extra charge for child 6-12 years with bed on CP plan';
COMMENT ON COLUMN hotel_room_configs.adult_above_12_cp IS 'Extra charge for adult above 12 years on CP plan';
COMMENT ON COLUMN hotel_room_configs.child_6_12_without_bed_map IS 'Extra charge for child 6-12 years without bed on MAP plan';
COMMENT ON COLUMN hotel_room_configs.child_6_12_with_bed_map IS 'Extra charge for child 6-12 years with bed on MAP plan';
COMMENT ON COLUMN hotel_room_configs.adult_above_12_map IS 'Extra charge for adult above 12 years on MAP plan';
