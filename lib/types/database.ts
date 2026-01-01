export type Profile = {
  id: string
  username: string
  display_name: string | null
  beaver_coins: number
  colony_xp: number
  beaver_level: "seedling" | "kit" | "adult"
  online_status: boolean
  last_seen: string
  created_at: string
  updated_at: string
}

export type Habit = {
  id: string
  user_id: string
  name: string
  icon: string
  xp: number
  frequency: "daily" | "weekly" | "custom"
  custom_days: string[] | null
  streak: number
  is_squad_habit: boolean
  squad_id: string | null
  created_at: string
  updated_at: string
}

export type HabitCompletion = {
  id: string
  habit_id: string
  user_id: string
  completed_at: string
  custom_xp: number | null
  custom_name: string | null
  date: string
}

export type Customization = {
  id: string
  user_id: string
  item_type: "accessory" | "dam"
  item_id: string
  is_equipped: boolean
  purchased_at: string
}

export type Squad = {
  id: string
  name: string
  created_by: string
  created_at: string
  updated_at: string
}

export type SquadMember = {
  id: string
  squad_id: string
  user_id: string
  role: "owner" | "admin" | "member"
  joined_at: string
}

export type Friendship = {
  id: string
  user_id: string
  friend_id: string
  status: "pending" | "accepted" | "rejected"
  created_at: string
}

export type Nudge = {
  id: string
  from_user_id: string
  to_user_id: string
  created_at: string
}

export type Activity = {
  id: string
  user_id: string
  activity_type: "habit_completed" | "streak_milestone" | "level_up" | "squad_goal"
  habit_name: string | null
  xp_earned: number | null
  metadata: any
  created_at: string
}

export type ChatMessage = {
  id: string
  squad_id: string
  user_id: string
  message: string
  created_at: string
}
