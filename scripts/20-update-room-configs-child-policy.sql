-- Add detailed child policy columns to hotel_room_configs table
ALTER TABLE hotel_room_configs 
  DROP COLUMN IF EXISTS child_policy;

ALTER TABLE hotel_room_configs
  ADD COLUMN child_6_12_without_bed_rate NUMERIC(10,2),
  ADD COLUMN child_6_12_with_bed_rate NUMERIC(10,2),
  ADD COLUMN adult_above_12_rate NUMERIC(10,2);

COMMENT ON COLUMN hotel_room_configs.child_6_12_without_bed_rate IS 'Rate for child 6-12 years without bed';
COMMENT ON COLUMN hotel_room_configs.child_6_12_with_bed_rate IS 'Rate for child 6-12 years with bed';
COMMENT ON COLUMN hotel_room_configs.adult_above_12_rate IS 'Rate for adult above 12 years';
