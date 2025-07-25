/*
  # Create menu items and orders system

  1. New Tables
    - `menu_items`
      - `id` (uuid, primary key)
      - `name` (text)
      - `price` (numeric)
      - `image` (text)
      - `category` (text)
      - `is_veg` (boolean)
      - `created_at` (timestamp)
    
    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `order_number` (text, unique)
      - `items` (jsonb)
      - `total_amount` (numeric)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read on menu_items
    - Add policies for authenticated users on orders
*/

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric NOT NULL,
  image text NOT NULL,
  category text NOT NULL,
  is_veg boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  order_number text UNIQUE NOT NULL,
  items jsonb NOT NULL,
  total_amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'preparing',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read menu items"
  ON menu_items
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read orders"
  ON orders
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create orders"
  ON orders
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (true);

-- Insert sample menu items
INSERT INTO menu_items (name, price, image, category, is_veg) VALUES
  ('Chicken Biryani', 299, 'https://images.pexels.com/photos/2456435/pexels-photo-2456435.jpeg?auto=compress&cs=tinysrgb&w=400', 'biryani', false),
  ('Veg Biryani', 249, 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=400', 'biryani', true),
  ('Mutton Biryani', 399, 'https://images.pexels.com/photos/2456435/pexels-photo-2456435.jpeg?auto=compress&cs=tinysrgb&w=400', 'biryani', false),
  ('Chicken Momos', 149, 'https://images.pexels.com/photos/4099238/pexels-photo-4099238.jpeg?auto=compress&cs=tinysrgb&w=400', 'momos', false),
  ('Veg Momos', 129, 'https://images.pexels.com/photos/4099238/pexels-photo-4099238.jpeg?auto=compress&cs=tinysrgb&w=400', 'momos', true),
  ('Paneer Momos', 159, 'https://images.pexels.com/photos/4099238/pexels-photo-4099238.jpeg?auto=compress&cs=tinysrgb&w=400', 'momos', true),
  ('Chicken Roll', 199, 'https://images.pexels.com/photos/2456435/pexels-photo-2456435.jpeg?auto=compress&cs=tinysrgb&w=400', 'rolls', false),
  ('Veg Roll', 149, 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=400', 'rolls', true),
  ('Egg Roll', 169, 'https://images.pexels.com/photos/2456435/pexels-photo-2456435.jpeg?auto=compress&cs=tinysrgb&w=400', 'rolls', false),
  ('Chocolate Shake', 99, 'https://images.pexels.com/photos/103566/pexels-photo-103566.jpeg?auto=compress&cs=tinysrgb&w=400', 'shakes', true),
  ('Vanilla Shake', 89, 'https://images.pexels.com/photos/103566/pexels-photo-103566.jpeg?auto=compress&cs=tinysrgb&w=400', 'shakes', true),
  ('Strawberry Shake', 109, 'https://images.pexels.com/photos/103566/pexels-photo-103566.jpeg?auto=compress&cs=tinysrgb&w=400', 'shakes', true);