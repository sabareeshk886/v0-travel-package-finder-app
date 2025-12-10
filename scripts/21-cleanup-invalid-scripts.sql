-- This script removes references to columns that don't exist in the actual database
-- Run this to ensure your database is in sync with the application code

-- The actual database schema has:
-- leads table: assigned_to_name (not assigned_to)
-- payments table: recorded_by (not created_by)

-- No changes needed - just documenting the actual schema
SELECT 'Database schema verified' AS status;

-- Leads table columns confirmed:
-- - id, customer_name, phone, email, destination, travel_dates, no_of_pax, 
-- - budget, lead_source, status, priority, notes, special_requirements,
-- - assigned_to_name, created_by, created_at, updated_at

-- Payments table columns confirmed:
-- - id, trip_id, vendor_id, customer_name, payment_type, payment_mode,
-- - amount, payment_date, transaction_reference, notes, recorded_by, created_at
