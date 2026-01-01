-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.squads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.squad_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nudges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view any profile" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Habits policies
CREATE POLICY "Users can view own habits and squad habits they're in" ON public.habits
  FOR SELECT USING (
    user_id = auth.uid() OR
    (is_squad_habit AND squad_id IN (
      SELECT squad_id FROM public.squad_members WHERE user_id = auth.uid()
    ))
  );

CREATE POLICY "Users can insert own habits" ON public.habits
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own habits" ON public.habits
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own habits" ON public.habits
  FOR DELETE USING (user_id = auth.uid());

-- Habit completions policies
CREATE POLICY "Users can view own completions and squad members completions" ON public.habit_completions
  FOR SELECT USING (
    user_id = auth.uid() OR
    habit_id IN (
      SELECT h.id FROM public.habits h
      JOIN public.squad_members sm ON h.squad_id = sm.squad_id
      WHERE sm.user_id = auth.uid() AND h.is_squad_habit = true
    )
  );

CREATE POLICY "Users can insert own completions" ON public.habit_completions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own completions" ON public.habit_completions
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own completions" ON public.habit_completions
  FOR DELETE USING (user_id = auth.uid());

-- Customizations policies
CREATE POLICY "Users can view own customizations" ON public.customizations
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own customizations" ON public.customizations
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own customizations" ON public.customizations
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own customizations" ON public.customizations
  FOR DELETE USING (user_id = auth.uid());

-- Squads policies
CREATE POLICY "Squad members can view their squads" ON public.squads
  FOR SELECT USING (
    id IN (SELECT squad_id FROM public.squad_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create squads" ON public.squads
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Squad owners can update squads" ON public.squads
  FOR UPDATE USING (
    id IN (
      SELECT squad_id FROM public.squad_members 
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

CREATE POLICY "Squad owners can delete squads" ON public.squads
  FOR DELETE USING (created_by = auth.uid());

-- Squad members policies
CREATE POLICY "Squad members can view squad members" ON public.squad_members
  FOR SELECT USING (
    squad_id IN (SELECT squad_id FROM public.squad_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Squad admins can add members" ON public.squad_members
  FOR INSERT WITH CHECK (
    squad_id IN (
      SELECT squad_id FROM public.squad_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Users can leave squads" ON public.squad_members
  FOR DELETE USING (user_id = auth.uid());

-- Friendships policies
CREATE POLICY "Users can view their friendships" ON public.friendships
  FOR SELECT USING (user_id = auth.uid() OR friend_id = auth.uid());

CREATE POLICY "Users can create friend requests" ON public.friendships
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update received friend requests" ON public.friendships
  FOR UPDATE USING (friend_id = auth.uid());

CREATE POLICY "Users can delete their friendships" ON public.friendships
  FOR DELETE USING (user_id = auth.uid() OR friend_id = auth.uid());

-- Nudges policies
CREATE POLICY "Users can view nudges sent to them" ON public.nudges
  FOR SELECT USING (to_user_id = auth.uid() OR from_user_id = auth.uid());

CREATE POLICY "Users can send nudges to friends" ON public.nudges
  FOR INSERT WITH CHECK (
    from_user_id = auth.uid() AND
    to_user_id IN (
      SELECT friend_id FROM public.friendships 
      WHERE user_id = auth.uid() AND status = 'accepted'
    )
  );

-- Activities policies
CREATE POLICY "Users can view activities from friends and squad members" ON public.activities
  FOR SELECT USING (
    user_id IN (
      SELECT friend_id FROM public.friendships 
      WHERE user_id = auth.uid() AND status = 'accepted'
      UNION
      SELECT user_id FROM public.squad_members 
      WHERE squad_id IN (
        SELECT squad_id FROM public.squad_members WHERE user_id = auth.uid()
      )
    ) OR user_id = auth.uid()
  );

CREATE POLICY "Users can insert own activities" ON public.activities
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Chat messages policies
CREATE POLICY "Squad members can view squad messages" ON public.chat_messages
  FOR SELECT USING (
    squad_id IN (SELECT squad_id FROM public.squad_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Squad members can send messages" ON public.chat_messages
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    squad_id IN (SELECT squad_id FROM public.squad_members WHERE user_id = auth.uid())
  );
