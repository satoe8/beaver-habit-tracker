"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  CheckCircle2,
  Users,
  Sparkles,
  Trophy,
  Target,
  Droplet,
  Dumbbell,
  Book,
  Moon,
  Apple,
  Zap,
  UserPlus,
  Plus,
  Calendar,
  Menu,
  X,
  Coins,
  LogOut,
} from "lucide-react"
import BeaverAvatar from "@/components/beaver-avatar"
import HoldToConfirmButton from "@/components/hold-to-confirm-button"
import ActivityFeed from "@/components/activity-feed"
import SharedGoalCard from "@/components/shared-goal-card"
import FriendsPanel from "@/components/friends-panel"
import HabitBuilder from "@/components/habit-builder"
import HabitCalendar from "@/components/habit-calendar"
import CustomizationShop from "@/components/customization-shop"
import MultiplayerPanel from "@/components/multiplayer-panel"
import PetMode from "@/components/pet-mode"

export interface Habit {
  id: string
  name: string
  icon: React.ReactNode
  iconName: string
  completed: boolean
  streak: number
  xp: number
  frequency: "daily" | "weekly" | "custom"
  customDays?: number[]
}

interface SquadHabit {
  id: string
  name: string
  icon: React.ReactNode
  completedBy: string[]
  totalMembers: number
  xp: number
}

interface Friend {
  id: string
  name: string
  initials: string
  color: string
  level: "seedling" | "kit" | "adult"
  xp: number
  online: boolean
}

export interface HabitDashboardProps {
  userId: string
}

export default function HabitDashboard({ userId }: HabitDashboardProps) {
  const [myHabits, setMyHabits] = useState<Habit[]>([])
  const [squadHabits, setSquadHabits] = useState<SquadHabit[]>([
    {
      id: "1",
      name: "Team Meditation",
      icon: <Sparkles className="w-5 h-5" />,
      completedBy: ["You", "Alex"],
      totalMembers: 4,
      xp: 25,
    },
    {
      id: "2",
      name: "Healthy Eating",
      icon: <Apple className="w-5 h-5" />,
      completedBy: ["Sarah"],
      totalMembers: 4,
      xp: 20,
    },
  ])
  const [colonyXP, setColonyXP] = useState(0)
  const [beaverLevel, setBeaverLevel] = useState<"seedling" | "kit" | "adult">("seedling")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [friends, setFriends] = useState<Friend[]>([])
  const [showFriendsPanel, setShowFriendsPanel] = useState(false)
  const [showHabitBuilder, setShowHabitBuilder] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showShop, setShowShop] = useState(false)
  const [showMultiplayer, setShowMultiplayer] = useState(false)
  const [beaverCoins, setBeaverCoins] = useState(0)
  const [equippedBeaverItems, setEquippedBeaverItems] = useState<string[]>([])
  const [equippedDamTheme, setEquippedDamTheme] = useState<string>("default")
  const [isPetMode, setIsPetMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadUserData()
  }, [userId])

  const loadUserData = async () => {
    setIsLoading(true)
    const supabase = getSupabaseBrowserClient()

    try {
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (profile) {
        setColonyXP(profile.colony_xp)
        setBeaverCoins(profile.beaver_coins)
        setBeaverLevel(profile.beaver_level)
      }

      const { data: habits } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", userId)
        .eq("is_squad_habit", false)

      if (habits) {
        const mappedHabits = habits.map((h) => ({
          id: h.id,
          name: h.name,
          icon: getIconComponent(h.icon),
          iconName: h.icon,
          completed: false,
          streak: h.streak,
          xp: h.xp,
          frequency: h.frequency as "daily" | "weekly" | "custom",
          customDays: h.custom_days ? h.custom_days.map((d) => getDayNumber(d)) : undefined,
        }))
        setMyHabits(mappedHabits)
      }

      const today = new Date().toISOString().split("T")[0]
      const { data: completions } = await supabase
        .from("habit_completions")
        .select("habit_id")
        .eq("user_id", userId)
        .eq("date", today)

      if (completions) {
        const completedIds = completions.map((c) => c.habit_id)
        setMyHabits((prev) => prev.map((h) => ({ ...h, completed: completedIds.includes(h.id) })))
      }

      const { data: customizations } = await supabase
        .from("customizations")
        .select("*")
        .eq("user_id", userId)
        .eq("is_equipped", true)

      if (customizations) {
        const beaverItems = customizations.filter((c) => c.item_type === "accessory").map((c) => c.item_id)
        const damTheme = customizations.find((c) => c.item_type === "dam")

        setEquippedBeaverItems(beaverItems)
        if (damTheme) {
          setEquippedDamTheme(damTheme.item_id)
        }
      }

      const { data: friendships } = await supabase
        .from("friendships")
        .select("friend_id, profiles!friendships_friend_id_fkey(*)")
        .eq("user_id", userId)
        .eq("status", "accepted")

      if (friendships) {
        const mappedFriends = friendships
          .filter((f) => f.profiles)
          .map((f: any) => ({
            id: f.friend_id,
            name: f.profiles.display_name || f.profiles.username,
            initials: getInitials(f.profiles.display_name || f.profiles.username),
            color: getRandomColor(),
            level: f.profiles.beaver_level,
            xp: f.profiles.colony_xp,
            online: f.profiles.online_status,
          }))
        setFriends(mappedFriends)
      }
    } catch (error) {
      console.error("[v0] Error loading user data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleHabitComplete = async (habitId: string) => {
    const supabase = getSupabaseBrowserClient()
    const habit = myHabits.find((h) => h.id === habitId)

    if (!habit || habit.completed) return

    try {
      const { data, error } = await supabase.rpc("complete_habit", {
        p_habit_id: habitId,
      })

      if (error) throw error

      if (data) {
        setMyHabits((habits) => habits.map((h) => (h.id === habitId ? { ...h, completed: true } : h)))
        setColonyXP((prev) => prev + data.xp_earned)
        setBeaverCoins((prev) => prev + data.coins_earned)
      }
    } catch (error) {
      console.error("[v0] Error completing habit:", error)
    }
  }

  const handleAddFriend = (friendName: string) => {
    const colors = ["bg-blue-500", "bg-purple-500", "bg-orange-500", "bg-green-500", "bg-red-500", "bg-cyan-500"]
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    const initials = friendName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()

    const newFriend: Friend = {
      id: Date.now().toString(),
      name: friendName,
      initials: initials,
      color: randomColor,
      level: "seedling",
      xp: 0,
      online: Math.random() > 0.5,
    }

    setFriends((prev) => [...prev, newFriend])
  }

  const handleRemoveFriend = (friendId: string) => {
    setFriends((prev) => prev.filter((f) => f.id !== friendId))
  }

  const handleCreateHabit = async (habit: Omit<Habit, "id" | "completed" | "streak">) => {
    const supabase = getSupabaseBrowserClient()

    try {
      const { data, error } = await supabase
        .from("habits")
        .insert({
          user_id: userId,
          name: habit.name,
          icon: habit.iconName,
          xp: habit.xp,
          frequency: habit.frequency,
          custom_days: habit.customDays?.map((d) => getDayName(d)),
        })
        .select()
        .single()

      if (error) throw error

      if (data) {
        const newHabit: Habit = {
          id: data.id,
          name: data.name,
          icon: getIconComponent(data.icon),
          iconName: data.icon,
          completed: false,
          streak: 0,
          xp: data.xp,
          frequency: data.frequency as "daily" | "weekly" | "custom",
          customDays: habit.customDays,
        }
        setMyHabits((prev) => [...prev, newHabit])
      }
    } catch (error) {
      console.error("[v0] Error creating habit:", error)
    }
  }

  const handleDeleteHabit = async (habitId: string) => {
    const supabase = getSupabaseBrowserClient()

    try {
      const { error } = await supabase.from("habits").delete().eq("id", habitId)

      if (error) throw error

      setMyHabits((prev) => prev.filter((h) => h.id !== habitId))
    } catch (error) {
      console.error("[v0] Error deleting habit:", error)
    }
  }

  const handleEditHabit = (habitId: string, updates: Partial<Habit>) => {
    setMyHabits((prev) => prev.map((h) => (h.id === habitId ? { ...h, ...updates } : h)))
  }

  const handlePurchase = async (itemId: string, cost: number, itemType: "accessory" | "dam") => {
    const supabase = getSupabaseBrowserClient()

    try {
      const { data, error } = await supabase.rpc("purchase_customization", {
        p_item_type: itemType,
        p_item_id: itemId,
        p_cost: cost,
      })

      if (error) throw error

      if (data) {
        setBeaverCoins(data.remaining_coins)
      }
    } catch (error) {
      console.error("[v0] Error purchasing item:", error)
    }
  }

  const handleEquip = async (itemId: string, category: "beaver" | "dam") => {
    const supabase = getSupabaseBrowserClient()
    const itemType = category === "beaver" ? "accessory" : "dam"

    try {
      await supabase
        .from("customizations")
        .update({ is_equipped: false })
        .eq("user_id", userId)
        .eq("item_type", itemType)

      const { error } = await supabase
        .from("customizations")
        .update({ is_equipped: true })
        .eq("user_id", userId)
        .eq("item_type", itemType)
        .eq("item_id", itemId)

      if (error) throw error

      if (category === "beaver") {
        setEquippedBeaverItems((prev) => {
          if (prev.includes(itemId)) return prev
          return [...prev, itemId]
        })
      } else if (category === "dam") {
        setEquippedDamTheme(itemId)
      }
    } catch (error) {
      console.error("[v0] Error equipping item:", error)
    }
  }

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  useEffect(() => {
    if (colonyXP < 200) {
      setBeaverLevel("seedling")
    } else if (colonyXP < 500) {
      setBeaverLevel("kit")
    } else {
      setBeaverLevel("adult")
    }
  }, [colonyXP])

  const totalXPForLevel = 500
  const progressPercent = (colonyXP / totalXPForLevel) * 100

  if (isPetMode) {
    return (
      <PetMode
        level={beaverLevel}
        equippedItems={equippedBeaverItems}
        damTheme={equippedDamTheme}
        onClose={() => setIsPetMode(false)}
      />
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Loading your colony...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
        <h1 className="text-lg font-bold text-foreground">Beaver Colony</h1>
        <Badge
          variant="outline"
          className="gap-1 cursor-pointer hover:bg-accent/10 transition-colors"
          onClick={() => setShowShop(true)}
        >
          <Coins className="w-3.5 h-3.5 text-accent" />
          {beaverCoins}
        </Badge>
      </div>

      {/* Sidebar */}
      <aside
        className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} ${isSidebarOpen ? "w-72" : "lg:w-72"} bg-sidebar border-r border-sidebar-border transition-transform duration-300 fixed lg:relative h-full z-40 overflow-y-auto`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-sidebar-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-sidebar-foreground">Beaver Colony</h1>
                <p className="text-xs text-sidebar-foreground/70">Build Together</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="gap-1.5 hidden lg:flex cursor-pointer hover:bg-accent/10 transition-colors"
                onClick={() => setShowShop(true)}
              >
                <Coins className="w-4 h-4 text-accent" />
                {beaverCoins}
              </Badge>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="hidden lg:flex" title="Logout">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* My Habits Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-sidebar-foreground/70" />
              <h2 className="text-sm font-semibold text-sidebar-foreground uppercase tracking-wide">My Habits</h2>
            </div>
            <div className="space-y-2">
              {myHabits.map((habit) => (
                <button
                  key={habit.id}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent hover:bg-sidebar-accent/80 transition-colors text-left group"
                >
                  <div className={`flex-shrink-0 ${habit.completed ? "text-accent" : "text-sidebar-foreground/70"}`}>
                    {habit.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">{habit.name}</p>
                    <p className="text-xs text-sidebar-foreground/60">{habit.streak} day streak</p>
                  </div>
                  {habit.completed && <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Squad Habits Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-sidebar-foreground/70" />
                <h2 className="text-sm font-semibold text-sidebar-foreground uppercase tracking-wide">Squad Habits</h2>
              </div>
              <button
                onClick={() => setShowMultiplayer(true)}
                className="p-1.5 rounded-md hover:bg-sidebar-accent transition-colors"
                aria-label="Manage squads"
              >
                <Plus className="w-4 h-4 text-sidebar-foreground/70" />
              </button>
            </div>
            <div className="space-y-2">
              {squadHabits.map((habit) => (
                <button
                  key={habit.id}
                  onClick={() => setShowMultiplayer(true)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent hover:bg-sidebar-accent/80 transition-colors text-left"
                >
                  <div className="flex-shrink-0 text-sidebar-foreground/70">{habit.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">{habit.name}</p>
                    <p className="text-xs text-sidebar-foreground/60">
                      {habit.completedBy.length}/{habit.totalMembers} completed
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Friends Section */}
          <div className="mt-8 pt-6 border-t border-sidebar-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-sidebar-foreground/70" />
                <h2 className="text-sm font-semibold text-sidebar-foreground uppercase tracking-wide">Friends</h2>
              </div>
              <button
                onClick={() => setShowFriendsPanel(true)}
                className="p-1.5 rounded-md hover:bg-sidebar-accent transition-colors"
                aria-label="Add friend"
              >
                <UserPlus className="w-4 h-4 text-sidebar-foreground/70" />
              </button>
            </div>
            <div className="space-y-2">
              {friends.slice(0, 4).map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors cursor-pointer"
                  onClick={() => setShowMultiplayer(true)}
                >
                  <div className="relative">
                    <Avatar className={`${friend.color} w-8 h-8`}>
                      <AvatarFallback className="text-white text-xs font-semibold">{friend.initials}</AvatarFallback>
                    </Avatar>
                    {friend.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-sidebar rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">{friend.name}</p>
                    <p className="text-xs text-sidebar-foreground/60">{friend.xp} XP</p>
                  </div>
                </div>
              ))}
              {friends.length > 4 && (
                <button
                  onClick={() => setShowFriendsPanel(true)}
                  className="w-full text-xs text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors text-center py-2"
                >
                  +{friends.length - 4} more friends
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto pt-16 lg:pt-0">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-1 text-balance">Habit Arena</h1>
                <p className="text-muted-foreground leading-relaxed">
                  Your beaver is counting on you! Complete habits to grow your colony.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={() => setShowCalendar(true)}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Calendar
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowMultiplayer(true)}>
                  <Users className="w-4 h-4 mr-2" />
                  Squads
                </Button>
                <Badge variant="secondary" className="flex items-center gap-1 h-9 px-3">
                  <Trophy className="w-4 h-4" />
                  Rank #42
                </Badge>
              </div>
            </div>
          </div>

          {/* Colony XP Bar */}
          <Card className="mb-6 border border-border bg-card shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="text-lg mb-1">Colony XP</CardTitle>
                  <CardDescription className="leading-relaxed">
                    {colonyXP} / {totalXPForLevel} XP • Level:{" "}
                    {beaverLevel === "seedling" ? "Seedling" : beaverLevel === "kit" ? "Kit" : "Adult Beaver"}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-accent/10 border-accent text-accent-foreground w-fit">
                  <Zap className="w-3.5 h-3.5 mr-1.5" />+
                  {myHabits.reduce((sum, h) => sum + (h.completed ? h.xp : 0), 0)} Today
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={progressPercent} className="h-2.5" />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Beaver Arena & Habits */}
            <div className="lg:col-span-2 space-y-6">
              {/* Beaver Avatar */}
              <div className="relative">
                <BeaverAvatar
                  level={beaverLevel}
                  xp={colonyXP}
                  equippedItems={equippedBeaverItems}
                  damTheme={equippedDamTheme}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsPetMode(true)}
                  className="absolute top-4 left-4 z-10 gap-1.5 bg-background/80 backdrop-blur-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Pet Mode
                </Button>
              </div>

              {/* My Habits */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        Today's Habits
                      </CardTitle>
                      <CardDescription>Hold to confirm each habit completion</CardDescription>
                    </div>
                    <Button onClick={() => setShowHabitBuilder(true)} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      New Habit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {myHabits.map((habit) => (
                    <div
                      key={habit.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border border-border"
                    >
                      <div
                        className={`flex-shrink-0 p-3 rounded-lg ${habit.completed ? "bg-accent/20 text-accent-foreground" : "bg-muted text-muted-foreground"}`}
                      >
                        {habit.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{habit.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            +{habit.xp} XP
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{habit.streak} day streak 🔥</p>
                      </div>
                      <HoldToConfirmButton
                        onComplete={() => handleHabitComplete(habit.id)}
                        disabled={habit.completed}
                        completed={habit.completed}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Shared Goal Card */}
              <SharedGoalCard />
            </div>

            {/* Right Column - Activity Feed */}
            <div className="lg:col-span-1">
              <ActivityFeed />
            </div>
          </div>
        </div>
      </main>

      {/* Friends Panel Overlay */}
      <FriendsPanel
        friends={friends}
        isOpen={showFriendsPanel}
        onClose={() => setShowFriendsPanel(false)}
        onAddFriend={handleAddFriend}
        onRemoveFriend={handleRemoveFriend}
      />

      {/* Habit Builder Overlay */}
      <HabitBuilder
        isOpen={showHabitBuilder}
        onClose={() => setShowHabitBuilder(false)}
        onCreateHabit={handleCreateHabit}
        existingHabits={myHabits}
        onDeleteHabit={handleDeleteHabit}
        onEditHabit={handleEditHabit}
      />

      {/* Calendar View Overlay */}
      <HabitCalendar
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
        habits={myHabits}
        onEditHabit={handleEditHabit}
      />

      {/* Customization Shop Overlay */}
      <CustomizationShop
        isOpen={showShop}
        onClose={() => setShowShop(false)}
        beaverCoins={beaverCoins}
        onPurchase={handlePurchase}
        onEquip={handleEquip}
      />

      {/* Multiplayer Panel Overlay */}
      <MultiplayerPanel isOpen={showMultiplayer} onClose={() => setShowMultiplayer(false)} friends={friends} />
    </div>
  )
}

function getIconComponent(iconName: string) {
  const icons: Record<string, React.ReactNode> = {
    droplet: <Droplet className="w-5 h-5" />,
    dumbbell: <Dumbbell className="w-5 h-5" />,
    book: <Book className="w-5 h-5" />,
    moon: <Moon className="w-5 h-5" />,
    apple: <Apple className="w-5 h-5" />,
    sparkles: <Sparkles className="w-5 h-5" />,
  }
  return icons[iconName] || <Target className="w-5 h-5" />
}

function getDayNumber(dayName: string): number {
  const days: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  }
  return days[dayName.toLowerCase()] || 0
}

function getDayName(dayNumber: number): string {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
  return days[dayNumber] || "sunday"
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function getRandomColor(): string {
  const colors = ["bg-blue-500", "bg-purple-500", "bg-orange-500", "bg-green-500", "bg-red-500", "bg-cyan-500"]
  return colors[Math.floor(Math.random() * colors.length)]
}
