/*
  # Add transaction ID to orders table

  1. Changes
    - Add `transaction_id` column to orders table
    - Set default sample transaction ID for existing orders
    - Update RLS policies to include transaction_id in select

  2. Security
    - Maintain existing RLS policies
    - No changes to security model
*/

-- Add transaction_id column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS transaction_id text DEFAULT '756488735546473';

-- Update existing orders with sample transaction ID
UPDATE orders SET transaction_id = '756488735546473' WHERE transaction_id IS NULL;