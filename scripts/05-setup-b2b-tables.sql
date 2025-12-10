-- Add itinerary column to b2bnorth table
ALTER TABLE b2bnorth ADD COLUMN IF NOT EXISTS itinerary TEXT;

-- Disable RLS on B2B tables (add more as you create them)
ALTER TABLE b2bnorth DISABLE ROW LEVEL SECURITY;

-- When you create other B2B tables, add them here:
-- ALTER TABLE b2bsouth ADD COLUMN IF NOT EXISTS itinerary TEXT;
-- ALTER TABLE b2bsouth DISABLE ROW LEVEL SECURITY;
-- 
-- ALTER TABLE b2bkashmir ADD COLUMN IF NOT EXISTS itinerary TEXT;
-- ALTER TABLE b2bkashmir DISABLE ROW LEVEL SECURITY;
-- 
-- ALTER TABLE b2bnortheast ADD COLUMN IF NOT EXISTS itinerary TEXT;
-- ALTER TABLE b2bnortheast DISABLE ROW LEVEL SECURITY;
-- 
-- ALTER TABLE b2binternational ADD COLUMN IF NOT EXISTS itinerary TEXT;
-- ALTER TABLE b2binternational DISABLE ROW LEVEL SECURITY;
