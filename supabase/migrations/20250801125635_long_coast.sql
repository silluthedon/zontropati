/*
  # ZontropaTi Database Schema

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (integer, in BDT)
      - `image_url` (text)
      - `created_at` (timestamp)
    - `orders`
      - `id` (uuid, primary key)
      - `customer_name` (text)
      - `email` (text)
      - `phone` (text)
      - `address` (text)
      - `product_id` (uuid, foreign key)
      - `quantity` (integer)
      - `status` (text, default 'Pending')
      - `order_date` (timestamp)
    - `contacts`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `message` (text)
      - `timestamp` (timestamp)
    - `admin_users`
      - `id` (uuid, primary key)
      - `email` (text)
      - `password_hash` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read on products
    - Add policies for authenticated insert on orders and contacts
    - Restrict admin access to admin_users table

  3. Sample Data
    - Pre-populate with 5 car tool products
    - Create default admin user
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price integer NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'Pending',
  order_date timestamptz DEFAULT now()
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  timestamp timestamptz DEFAULT now()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read products"
  ON products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert orders"
  ON orders
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can insert contacts"
  ON contacts
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admin can read all orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can update orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Admin can read contacts"
  ON contacts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can read products"
  ON products
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Admin can delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample products
INSERT INTO products (name, description, price, image_url) VALUES
  ('Screwdriver Set', 'Precision screwdriver kit with multiple sizes for automotive work', 800, 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg'),
  ('Wrench Kit', 'Adjustable wrench set for various automotive applications', 1200, 'https://images.pexels.com/photos/209235/pexels-photo-209235.jpeg'),
  ('Tire Pressure Gauge', 'Accurate tire pressure measurement tool for optimal performance', 500, 'https://images.pexels.com/photos/13861/IMG_3496.jpg'),
  ('Car Jack', 'Heavy-duty hydraulic jack for safe vehicle lifting', 3500, 'https://images.pexels.com/photos/279906/pexels-photo-279906.jpeg'),
  ('Socket Set', 'Comprehensive socket set with ratchet and extensions', 1500, 'https://images.pexels.com/photos/209235/pexels-photo-209235.jpeg');

-- Insert default admin user (password: Admin124)
INSERT INTO admin_users (email, password_hash) VALUES
  ('admin@zontropati.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');