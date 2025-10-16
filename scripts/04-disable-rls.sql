-- Disable Row Level Security on package tables
-- This is safe for internal tools that don't require user-level data protection

ALTER TABLE south DISABLE ROW LEVEL SECURITY;
ALTER TABLE north DISABLE ROW LEVEL SECURITY;
ALTER TABLE kashmir DISABLE ROW LEVEL SECURITY;
ALTER TABLE northeast DISABLE ROW LEVEL SECURITY;
ALTER TABLE international DISABLE ROW LEVEL SECURITY;

-- If you prefer to keep RLS enabled but allow public read access, use this instead:
-- CREATE POLICY "Allow public read access" ON south FOR SELECT USING (true);
-- CREATE POLICY "Allow public read access" ON north FOR SELECT USING (true);
-- CREATE POLICY "Allow public read access" ON kashmir FOR SELECT USING (true);
-- CREATE POLICY "Allow public read access" ON northeast FOR SELECT USING (true);
-- CREATE POLICY "Allow public read access" ON international FOR SELECT USING (true);
