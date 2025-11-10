-- Update hotel_room_configs to have separate rate columns for each meal plan
-- instead of single meal_plan dropdown and price_per_night

ALTER TABLE hotel_room_configs
DROP COLUMN IF EXISTS meal_plan,
DROP COLUMN IF EXISTS price_per_night;

ALTER TABLE hotel_room_configs
ADD COLUMN ep_rate NUMERIC,
ADD COLUMN cp_rate NUMERIC,
ADD COLUMN map_rate NUMERIC,
ADD COLUMN ap_rate NUMERIC;

COMMENT ON COLUMN hotel_room_configs.ep_rate IS 'EP (Room Only) rate per night';
COMMENT ON COLUMN hotel_room_configs.cp_rate IS 'CP (Breakfast) rate per night';
COMMENT ON COLUMN hotel_room_configs.map_rate IS 'MAP (Breakfast + Lunch/Dinner) rate per night';
COMMENT ON COLUMN hotel_room_configs.ap_rate IS 'AP (All Meals) rate per night';
