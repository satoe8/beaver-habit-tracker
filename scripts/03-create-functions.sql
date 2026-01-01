-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'beaver_' || substring(NEW.id::text from 1 for 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'Beaver User')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update beaver level based on XP
CREATE OR REPLACE FUNCTION public.update_beaver_level()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.colony_xp < 200 THEN
    NEW.beaver_level := 'seedling';
  ELSIF NEW.colony_xp < 500 THEN
    NEW.beaver_level := 'kit';
  ELSE
    NEW.beaver_level := 'adult';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update beaver level
CREATE TRIGGER update_beaver_level_trigger
  BEFORE UPDATE OF colony_xp ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_beaver_level();

-- Function to complete habit and award XP
CREATE OR REPLACE FUNCTION public.complete_habit(
  p_habit_id UUID,
  p_date DATE DEFAULT CURRENT_DATE,
  p_custom_xp INTEGER DEFAULT NULL,
  p_custom_name TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_habit RECORD;
  v_xp_earned INTEGER;
  v_new_total_xp INTEGER;
  v_coins_earned INTEGER;
BEGIN
  -- Get habit details
  SELECT * INTO v_habit FROM public.habits WHERE id = p_habit_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Habit not found';
  END IF;
  
  -- Check if already completed today
  IF EXISTS (
    SELECT 1 FROM public.habit_completions 
    WHERE habit_id = p_habit_id AND user_id = v_user_id AND date = p_date
  ) THEN
    RAISE EXCEPTION 'Habit already completed for this date';
  END IF;
  
  -- Use custom XP if provided, otherwise use habit's default XP
  v_xp_earned := COALESCE(p_custom_xp, v_habit.xp);
  v_coins_earned := CEIL(v_xp_earned / 2.0); -- Earn half the XP as coins
  
  -- Insert completion
  INSERT INTO public.habit_completions (habit_id, user_id, date, custom_xp, custom_name)
  VALUES (p_habit_id, v_user_id, p_date, p_custom_xp, p_custom_name);
  
  -- Update streak
  UPDATE public.habits
  SET streak = streak + 1
  WHERE id = p_habit_id;
  
  -- Update user XP and coins
  UPDATE public.profiles
  SET colony_xp = colony_xp + v_xp_earned,
      beaver_coins = beaver_coins + v_coins_earned
  WHERE id = v_user_id
  RETURNING colony_xp INTO v_new_total_xp;
  
  -- Create activity
  INSERT INTO public.activities (user_id, activity_type, habit_name, xp_earned)
  VALUES (v_user_id, 'habit_completed', COALESCE(p_custom_name, v_habit.name), v_xp_earned);
  
  RETURN jsonb_build_object(
    'success', true,
    'xp_earned', v_xp_earned,
    'coins_earned', v_coins_earned,
    'new_total_xp', v_new_total_xp
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to purchase and equip customization items
CREATE OR REPLACE FUNCTION public.purchase_customization(
  p_item_type TEXT,
  p_item_id TEXT,
  p_cost INTEGER
)
RETURNS JSONB AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_current_coins INTEGER;
BEGIN
  -- Check if already owned
  IF EXISTS (
    SELECT 1 FROM public.customizations 
    WHERE user_id = v_user_id AND item_type = p_item_type AND item_id = p_item_id
  ) THEN
    RAISE EXCEPTION 'Item already owned';
  END IF;
  
  -- Get current coins
  SELECT beaver_coins INTO v_current_coins FROM public.profiles WHERE id = v_user_id;
  
  IF v_current_coins < p_cost THEN
    RAISE EXCEPTION 'Insufficient coins';
  END IF;
  
  -- Deduct coins
  UPDATE public.profiles
  SET beaver_coins = beaver_coins - p_cost
  WHERE id = v_user_id;
  
  -- Add customization
  INSERT INTO public.customizations (user_id, item_type, item_id, is_equipped)
  VALUES (v_user_id, p_item_type, p_item_id, false);
  
  RETURN jsonb_build_object('success', true, 'remaining_coins', v_current_coins - p_cost);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
