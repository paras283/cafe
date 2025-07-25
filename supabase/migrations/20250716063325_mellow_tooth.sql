/*
  # Update orders table for anonymous users

  1. Schema Changes
    - Modify `orders` table to support anonymous users with `customer_id`
    - Add `payment_method` column for tracking payment types
    - Update RLS policies for customer-specific access

  2. Security
    - Enable RLS on `orders` table
    - Add policy for customers to read only their own orders
    - Add policy for authenticated users (admins) to manage all orders
    - Add policy for anonymous users to create orders

  3. New Columns
    - `customer_id` (text) - unique identifier for anonymous users
    - `payment_method` (text) - payment method used (upi, card, cash)
*/

-- Add new columns to orders table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'customer_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN customer_id text NOT NULL DEFAULT gen_random_uuid()::text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'payment_method'
  ) THEN
    ALTER TABLE orders ADD COLUMN payment_method text NOT NULL DEFAULT 'upi';
  END IF;
END $$;

-- Update existing orders to have customer_id if they don't have one
UPDATE orders SET customer_id = gen_random_uuid()::text WHERE customer_id IS NULL;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
DROP POLICY IF EXISTS "Anyone can read orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can update orders" ON orders;

-- Create new RLS policies
CREATE POLICY "Customers can read own orders"
  ON orders
  FOR SELECT
  TO public
  USING (customer_id = current_setting('request.headers')::json->>'customer-id');

CREATE POLICY "Anonymous users can create orders"
  ON orders
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read all orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update all orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (true);

-- Ensure RLS is enabled
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;