-- seed.sql: Demo Seed Data for VibeCheck Rooms
-- IMS Noida / CCSU BCA-508 Minor Project
-- Designed so that demo room "Late Night Crew" (Code: K7P2QX)
-- immediately displays 79 ("Good vibes"), Dominant Mood "chill", Avg Energy 3.8

DO $$
DECLARE
  v_gaurav_id UUID := '11111111-1111-1111-1111-111111111111'::uuid;
  v_rahul_id  UUID := '22222222-2222-2222-2222-222222222222'::uuid;
  v_aman_id   UUID := '33333333-3333-3333-3333-333333333333'::uuid;
  v_rohit_id  UUID := '44444444-4444-4444-4444-444444444444'::uuid;
  v_kavya_id  UUID := '55555555-5555-5555-5555-555555555555'::uuid;

  v_room_id   UUID := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid;
  
  v_c1 UUID := gen_random_uuid();
  v_c2 UUID := gen_random_uuid();
  v_c3 UUID := gen_random_uuid();
  v_c4 UUID := gen_random_uuid();
  v_c_hist UUID := gen_random_uuid();
BEGIN
  -- Insert Demo Profiles
  INSERT INTO profiles (id, display_name, email, avatar_color, created_at)
  VALUES
    (v_gaurav_id, 'Gaurav Singh', 'gaurav@vibecheck.demo', '#C6FF3D', now() - interval '5 days'),
    (v_rahul_id,  'Rahul',        'rahul@vibecheck.demo',  '#22D3EE', now() - interval '5 days'),
    (v_aman_id,   'Aman',         'aman@vibecheck.demo',   '#FF4D8D', now() - interval '4 days'),
    (v_rohit_id,  'Rohit',        'rohit@vibecheck.demo',  '#FFB020', now() - interval '4 days'),
    (v_kavya_id,  'Kavya',        'kavya@vibecheck.demo',  '#8B5CF6', now() - interval '3 days')
  ON CONFLICT (id) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    avatar_color = EXCLUDED.avatar_color;

  -- Insert Demo Room
  INSERT INTO rooms (id, name, room_code, created_by, is_active, created_at)
  VALUES (v_room_id, 'Late Night Crew', 'K7P2QX', v_gaurav_id, true, now() - interval '5 days')
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    room_code = EXCLUDED.room_code,
    is_active = true;

  -- Insert Room Members
  INSERT INTO room_members (room_id, user_id, role, joined_at)
  VALUES
    (v_room_id, v_gaurav_id, 'admin',  now() - interval '5 days'),
    (v_room_id, v_rahul_id,  'member', now() - interval '5 days'),
    (v_room_id, v_aman_id,   'member', now() - interval '4 days'),
    (v_room_id, v_rohit_id,  'member', now() - interval '4 days'),
    (v_room_id, v_kavya_id,  'member', now() - interval '3 days')
  ON CONFLICT (room_id, user_id) DO NOTHING;

  -- Clean existing checkins for demo room
  DELETE FROM mood_checkins WHERE room_id = v_room_id;

  -- Insert Today's Check-ins (within last 24h)
  -- 1. Rahul: chill, energy 3 (Mood Score: 70)
  INSERT INTO mood_checkins (id, room_id, user_id, mood, energy, note, created_at)
  VALUES (v_c1, v_room_id, v_rahul_id, 'chill', 3, 'Late night coding vibes', now() - interval '18 minutes');

  INSERT INTO songs (checkin_id, title, artist, link_url, position)
  VALUES
    (v_c1, 'Blinding Lights', 'The Weeknd', 'https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b', 1),
    (v_c1, 'Midnight City', 'M83', 'https://open.spotify.com/track/6GyFP1nfCDB87D2YQI5CrJ', 2);

  -- 2. Aman: hyped, energy 5 (Mood Score: 85)
  INSERT INTO mood_checkins (id, room_id, user_id, mood, energy, note, created_at)
  VALUES (v_c2, v_room_id, v_aman_id, 'hyped', 5, 'Submission grind mode!', now() - interval '32 minutes');

  INSERT INTO songs (checkin_id, title, artist, link_url, position)
  VALUES
    (v_c2, 'Starboy', 'The Weeknd', 'https://open.spotify.com/track/7MXVkk9YM5IZxh0WSlVIh0', 1),
    (v_c2, 'Kesariya', 'Arijit Singh', 'https://open.spotify.com/track/6WzRpRjhq4bsp5vT4m2b8Q', 2),
    (v_c2, 'Levitating', 'Dua Lipa', 'https://open.spotify.com/track/463CkQjx2Zk1yXoBu1egbh', 3);

  -- 3. Rohit: happy, energy 4 (Mood Score: 90)
  INSERT INTO mood_checkins (id, room_id, user_id, mood, energy, note, created_at)
  VALUES (v_c3, v_room_id, v_rohit_id, 'happy', 4, 'Weekend energy is here', now() - interval '1 hour');

  INSERT INTO songs (checkin_id, title, artist, link_url, position)
  VALUES
    (v_c3, 'Heat Waves', 'Glass Animals', 'https://open.spotify.com/track/02MWAaffLxlfxAUY7c5dvx', 1),
    (v_c3, 'Sunflower', 'Post Malone', 'https://open.spotify.com/track/3KkXRQHbMCARz0aVfEt68P', 2);

  -- 4. Gaurav: chill, energy 3 (Mood Score: 70)
  INSERT INTO mood_checkins (id, room_id, user_id, mood, energy, note, created_at)
  VALUES (v_c4, v_room_id, v_gaurav_id, 'chill', 3, 'Admin check-in: vibes looking solid', now() - interval '2 hours');

  INSERT INTO songs (checkin_id, title, artist, link_url, position)
  VALUES
    (v_c4, 'Tum Hi Ho', 'Arijit Singh', 'https://open.spotify.com/track/56zZ48jdyY2oDXhvV2QgEt', 1),
    (v_c4, 'Yellow', 'Coldplay', 'https://open.spotify.com/track/3AJwUDP919kvQ9QcozQPxg', 2);

  -- 5. Older checkin for History page (48 hours ago)
  INSERT INTO mood_checkins (id, room_id, user_id, mood, energy, note, created_at)
  VALUES (v_c_hist, v_room_id, v_kavya_id, 'nostalgic', 3, 'Old memories playlist', now() - interval '48 hours');

  INSERT INTO songs (checkin_id, title, artist, link_url, position)
  VALUES
    (v_c_hist, 'Apna Bana Le', 'Arijit Singh', 'https://open.spotify.com/track/0WbMK4wrZ1wFStV9Fwa992', 1);

END $$;
