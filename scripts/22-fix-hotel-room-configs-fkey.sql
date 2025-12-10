-- Fix the hotel_room_configs foreign key to reference vendors table instead of hotels table
-- This allows hotel vendors to have room configurations

-- Drop the existing foreign key constraint
ALTER TABLE hotel_room_configs 
DROP CONSTRAINT IF EXISTS hotel_room_configs_hotel_id_fkey;

-- Rename the column from hotel_id to vendor_id for clarity
ALTER TABLE hotel_room_configs 
RENAME COLUMN hotel_id TO vendor_id;

-- Add new foreign key constraint referencing vendors table
ALTER TABLE hotel_room_configs 
ADD CONSTRAINT hotel_room_configs_vendor_id_fkey 
FOREIGN KEY (vendor_id) 
REFERENCES vendors(id) 
ON DELETE CASCADE;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_hotel_room_configs_vendor_id 
ON hotel_room_configs(vendor_id);
