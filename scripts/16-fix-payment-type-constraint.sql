-- Fix the payment_type check constraint to allow proper values
-- First, drop the existing constraint
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_payment_type_check;

-- Add the correct constraint with the values we need
ALTER TABLE payments ADD CONSTRAINT payments_payment_type_check 
  CHECK (payment_type IN ('advance', 'balance', 'full', 'refund', 'received'));

-- Also fix payment_mode constraint if it exists
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_payment_mode_check;

-- Add payment_mode constraint with common payment methods
ALTER TABLE payments ADD CONSTRAINT payments_payment_mode_check 
  CHECK (payment_mode IN ('Cash', 'UPI', 'Bank Transfer', 'Card', 'Cheque', 'Online'));
