-- Add room_description column to hotel_room_configs table
ALTER TABLE hotel_room_configs
ADD COLUMN IF NOT EXISTS room_description TEXT;

-- Add a comment to the column
COMMENT ON COLUMN hotel_room_configs.room_description IS 'Optional description of the room type';
