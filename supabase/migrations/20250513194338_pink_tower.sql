/*
  # Initial schema setup for gamepass marketplace

  1. New Tables
    - users
      - id (uuid, primary key)
      - email (text)
      - role (text)
      - username (text)
      - avatar_url (text)
      - created_at (timestamp)
    
    - seller_applications
      - id (uuid, primary key)
      - user_id (uuid, references users)
      - status (text)
      - description (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - gamepasses
      - id (uuid, primary key)
      - seller_id (uuid, references users)
      - title (text)
      - description (text)
      - price (integer)
      - roblox_gamepass_id (bigint)
      - image_url (text)
      - status (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - orders
      - id (uuid, primary key)
      - user_id (uuid, references users)
      - gamepass_id (uuid, references gamepasses)
      - status (text)
      - roblox_username (text)
      - serial_key (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - reviews
      - id (uuid, primary key)
      - user_id (uuid, references users)
      - gamepass_id (uuid, references gamepasses)
      - rating (integer)
      - comment (text)
      - created_at (timestamp)
    
  2. Security
    - Enable RLS on all tables
    - Add policies for each table based on user roles
*/

-- Create enum types
CREATE TYPE user_role AS ENUM ('user', 'seller', 'moderator', 'admin');
CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE gamepass_status AS ENUM ('draft', 'published', 'suspended');
CREATE TYPE order_status AS ENUM ('pending', 'monitoring', 'completed', 'failed', 'expired');

-- Create users table
CREATE TABLE users (
  id uuid REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  role user_role DEFAULT 'user'::user_role,
  username text UNIQUE,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create seller applications table
CREATE TABLE seller_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users ON DELETE CASCADE NOT NULL,
  status application_status DEFAULT 'pending'::application_status,
  description text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id, status)
);

-- Create gamepasses table
CREATE TABLE gamepasses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid REFERENCES users ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  price integer NOT NULL CHECK (price >= 0),
  roblox_gamepass_id bigint NOT NULL,
  image_url text,
  status gamepass_status DEFAULT 'draft'::gamepass_status,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users ON DELETE CASCADE NOT NULL,
  gamepass_id uuid REFERENCES gamepasses ON DELETE CASCADE NOT NULL,
  status order_status DEFAULT 'pending'::order_status,
  roblox_username text NOT NULL,
  serial_key text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users ON DELETE CASCADE NOT NULL,
  gamepass_id uuid REFERENCES gamepasses ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, gamepass_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamepasses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- Seller applications policies
CREATE POLICY "Users can create own applications" ON seller_applications
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own applications" ON seller_applications
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR auth.jwt()->>'role' IN ('moderator', 'admin'));

-- Gamepasses policies
CREATE POLICY "Anyone can read published gamepasses" ON gamepasses
  FOR SELECT
  USING (status = 'published');

CREATE POLICY "Sellers can manage own gamepasses" ON gamepasses
  FOR ALL TO authenticated
  USING (auth.uid() = seller_id AND auth.jwt()->>'role' IN ('seller', 'admin'));

-- Orders policies
CREATE POLICY "Users can read own orders" ON orders
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders" ON orders
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Anyone can read reviews" ON reviews
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create reviews for purchased gamepasses" ON reviews
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.user_id = auth.uid()
      AND orders.gamepass_id = reviews.gamepass_id
      AND orders.status = 'completed'
    )
  );

-- Create functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_seller_applications_updated_at
  BEFORE UPDATE ON seller_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_gamepasses_updated_at
  BEFORE UPDATE ON gamepasses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();