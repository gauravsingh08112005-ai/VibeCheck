-- 0004_checkin_rpc.sql: Atomic Check-in and Song Creation
-- IMS Noida / CCSU BCA-508 Minor Project
-- Guarantees checkin row and up to 3 song rows are created in a single database transaction.

CREATE OR REPLACE FUNCTION create_checkin_with_songs(
  p_room_id UUID,
  p_user_id UUID,
  p_mood TEXT,
  p_energy INTEGER,
  p_note TEXT DEFAULT NULL,
  p_songs JSONB DEFAULT '[]'::jsonb
)
RETURNS JSONB AS $$
DECLARE
  v_checkin_id UUID;
  v_song RECORD;
  v_pos INTEGER := 1;
  v_result JSONB;
BEGIN
  -- Validate room is active
  IF NOT EXISTS (SELECT 1 FROM rooms WHERE id = p_room_id AND is_active = true) THEN
    RAISE EXCEPTION 'Room does not exist or has been closed' USING ERRCODE = 'P0002';
  END IF;

  -- Validate user is member of room
  IF NOT EXISTS (SELECT 1 FROM room_members WHERE room_id = p_room_id AND user_id = p_user_id) THEN
    RAISE EXCEPTION 'User is not a member of this room' USING ERRCODE = 'P0003';
  END IF;

  -- Insert checkin
  INSERT INTO mood_checkins (room_id, user_id, mood, energy, note, created_at)
  VALUES (p_room_id, p_user_id, p_mood, p_energy, NULLIF(TRIM(p_note), ''), now())
  RETURNING id INTO v_checkin_id;

  -- Insert songs (up to 3)
  FOR v_song IN SELECT * FROM jsonb_to_recordset(p_songs) AS s(title TEXT, artist TEXT, link TEXT)
  LOOP
    IF v_pos > 3 THEN
      EXIT;
    END IF;

    IF v_song.title IS NOT NULL AND TRIM(v_song.title) <> '' AND v_song.artist IS NOT NULL AND TRIM(v_song.artist) <> '' THEN
      INSERT INTO songs (checkin_id, title, artist, link_url, position)
      VALUES (
        v_checkin_id,
        SUBSTRING(TRIM(v_song.title) FROM 1 FOR 100),
        SUBSTRING(TRIM(v_song.artist) FROM 1 FOR 100),
        NULLIF(TRIM(v_song.link), ''),
        v_pos
      );
      v_pos := v_pos + 1;
    END IF;
  END LOOP;

  -- Build return payload
  SELECT jsonb_build_object(
    'id', mc.id,
    'roomId', mc.room_id,
    'userId', mc.user_id,
    'mood', mc.mood,
    'energy', mc.energy,
    'note', mc.note,
    'createdAt', mc.created_at
  ) INTO v_result
  FROM mood_checkins mc
  WHERE mc.id = v_checkin_id;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant EXECUTE only to authenticated/service_role
REVOKE EXECUTE ON FUNCTION create_checkin_with_songs FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION create_checkin_with_songs FROM anon;
GRANT EXECUTE ON FUNCTION create_checkin_with_songs TO authenticated;
GRANT EXECUTE ON FUNCTION create_checkin_with_songs TO service_role;
