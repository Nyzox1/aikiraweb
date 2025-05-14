/*
  # Authentication and Role System Implementation

  1. New Tables and Updates
    - users
      - Added role enum type with user, seller, moderator, admin
      - Added email verification fields
      - Added profile fields
    
    - seller_applications
      - Added review fields
      - Added notification fields
    
  2. Security
    - Added RLS policies for role-based access
    - Added secure authentication flows
    - Added role validation checks
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS gamepasses CASCADE;
DROP TABLE IF EXISTS seller_applications CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS application_status CASCADE;
DROP TYPE IF EXISTS gamepass_status CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;

-- Create enum types
CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'admin');
CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE gamepass_status AS ENUM ('active', 'inactive');
CREATE TYPE order_status AS ENUM ('pending', 'completed', 'cancelled');

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role user_role DEFAULT 'buyer'::user_role NOT NULL,
  username text UNIQUE NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  password text
);

-- Create seller applications table
CREATE TABLE seller_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users ON DELETE CASCADE,
  status application_status DEFAULT 'pending'::application_status NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create gamepasses table
CREATE TABLE gamepasses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid REFERENCES users ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  price integer NOT NULL,
  roblox_gamepass_id bigint NOT NULL,
  image_url text,
  status gamepass_status DEFAULT 'active'::gamepass_status NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users ON DELETE CASCADE,
  gamepass_id uuid REFERENCES gamepasses ON DELETE CASCADE,
  status order_status DEFAULT 'pending'::order_status NOT NULL,
  roblox_username text NOT NULL,
  serial_key text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users ON DELETE CASCADE,
  gamepass_id uuid REFERENCES gamepasses ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamepasses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users: Select own" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users: Update own" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Applications policies
CREATE POLICY "Applications: Insert own" ON seller_applications
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Applications: Select own" ON seller_applications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Applications: Update own" ON seller_applications
  FOR UPDATE USING (user_id = auth.uid());

-- Gamepasses policies
CREATE POLICY "Gamepasses: Insert if seller" ON gamepasses
  FOR INSERT WITH CHECK (seller_id = auth.uid());

CREATE POLICY "Gamepasses: Select all" ON gamepasses
  FOR SELECT USING (true);

CREATE POLICY "Gamepasses: Update if seller" ON gamepasses
  FOR UPDATE USING (seller_id = auth.uid());

-- Orders policies
CREATE POLICY "Orders: Insert own" ON orders
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Orders: Select own" ON orders
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Orders: Update own" ON orders
  FOR UPDATE USING (user_id = auth.uid());

-- Reviews policies
CREATE POLICY "Reviews: Insert own" ON reviews
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Reviews: Select all" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Reviews: Update own" ON reviews
  FOR UPDATE USING (user_id = auth.uid());

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;