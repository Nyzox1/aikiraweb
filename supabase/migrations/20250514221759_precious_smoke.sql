/*
  # Fix users table RLS policies

  1. Changes
    - Add policy for inserting new users during signup
    - Fix user selection policy
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- Create new policies
CREATE POLICY "Enable read access for all users" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable insert for authentication" ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);