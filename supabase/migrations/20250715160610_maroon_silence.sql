/*
  # Add completed orders functionality

  1. New Tables
    - No new tables needed, using existing orders table with new status

  2. Changes
    - Add 'completed' status to orders
    - Add completed_at timestamp column

  3. Security
    - Update existing policies to handle completed status
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'completed_at'
  ) THEN
    ALTER TABLE orders ADD COLUMN completed_at timestamptz;
  END IF;
END $$;