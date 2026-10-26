-- 0002_profile_trigger.sql: Automatically create user profile on Supabase Auth signup
-- IMS Noida / CCSU BCA-508 Minor Project

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  colors TEXT[] := ARRAY['#C6FF3D', '#22D3EE', '#FF4D8D', '#FFB020', '#8B5CF6', '#FB7185'];
  assigned_color TEXT;
  user_name TEXT;
BEGIN
  assigned_color := colors[1 + floor(random() * array_length(colors, 1))::int];
  user_name := COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1));
  
  INSERT INTO public.profiles (id, display_name, email, avatar_color, created_at)
  VALUES (
    new.id,
    SUBSTRING(user_name FROM 1 FOR 40),
    new.email,
    assigned_color,
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute upon auth.users insertion
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
