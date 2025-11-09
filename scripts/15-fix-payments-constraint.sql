-- Fix the payments table payment_type check constraint to allow correct values

-- Drop the old constraint
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_payment_type_check;

-- Add new constraint with correct values
ALTER TABLE payments 
ADD CONSTRAINT payments_payment_type_check 
CHECK (payment_type IN ('received', 'refund'));

-- Also fix payment_mode constraint to match form values
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_payment_mode_check;

ALTER TABLE payments 
ADD CONSTRAINT payments_payment_mode_check 
CHECK (payment_mode IN ('Cash', 'Bank Transfer', 'UPI', 'Credit Card', 'Debit Card', 'Cheque', 'Card'));
