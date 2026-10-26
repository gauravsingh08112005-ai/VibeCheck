-- 0001_schema.sql: VibeCheck Rooms Database Schema
-- IMS Noida / CCSU BCA-508 Minor Project

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Profiles table (mirrors auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL CHECK (char_length(display_name) BETWEEN 1 AND 40),
  email TEXT NOT NULL,
  avatar_color TEXT NOT NULL DEFAULT '#8B5CF6',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 40),
  room_code CHAR(6) NOT NULL UNIQUE CHECK (room_code ~ '^[A-Z0-9]{6}$'),
  created_by UUID NOT NULL REFERENCES profiles(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Room Members junction table (M:N)
CREATE TABLE IF NOT EXISTS room_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (room_id, user_id)
);

-- Mood Check-ins table
CREATE TABLE IF NOT EXISTS mood_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mood TEXT NOT NULL CHECK (mood IN ('happy', 'hyped', 'romantic', 'chill', 'focused', 'nostalgic', 'stressed', 'sad')),
  energy INTEGER NOT NULL CHECK (energy BETWEEN 1 AND 5),
  note TEXT CHECK (note IS NULL OR char_length(note) <= 80),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Songs table
CREATE TABLE IF NOT EXISTS songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checkin_id UUID NOT NULL REFERENCES mood_checkins(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 100),
  artist TEXT NOT NULL CHECK (char_length(artist) BETWEEN 1 AND 100),
  link_url TEXT CHECK (link_url IS NULL OR link_url ~* '^https?://'),
  position INTEGER NOT NULL CHECK (position BETWEEN 1 AND 3),
  UNIQUE (checkin_id, position)
);

-- Indexes for optimal performance
CREATE INDEX IF NOT EXISTS idx_room_members_user ON room_members (user_id);
CREATE INDEX IF NOT EXISTS idx_room_members_room ON room_members (room_id);
CREATE INDEX IF NOT EXISTS idx_mood_checkins_room_created ON mood_checkins (room_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mood_checkins_user_created ON mood_checkins (room_id, user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_songs_checkin ON songs (checkin_id);
