-- 0003_rls.sql: Row Level Security Configuration
-- IMS Noida / CCSU BCA-508 Minor Project
-- The API uses the Supabase Secret Key (service role) which bypasses RLS.
-- RLS provides defense-in-depth by denying all direct client operations except profile reads.

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view profiles
CREATE POLICY "Profiles are readable by authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Deny all direct client writes to rooms, members, checkins, songs
-- All application mutations are handled securely through the Express API backend
