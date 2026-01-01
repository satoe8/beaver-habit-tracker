"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Droplet, Dumbbell, Book, Sparkles, Trophy, Target } from "lucide-react"
import { useState, useEffect } from "react"

interface Activity {
  id: string
  user: string
  userInitials: string
  action: string
  habit: string
  xp: number
  icon: React.ReactNode
  timestamp: string
  color: string
}

export default function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "1",
      user: "Alex Rivera",
      userInitials: "AR",
      action: "completed",
      habit: "Drink Water",
      xp: 10,
      icon: <Droplet className="w-4 h-4" />,
      timestamp: "2 min ago",
      color: "bg-blue-500",
    },
    {
      id: "2",
      user: "Sarah Chen",
      userInitials: "SC",
      action: "completed",
      habit: "Morning Workout",
      xp: 15,
      icon: <Dumbbell className="w-4 h-4" />,
      timestamp: "5 min ago",
      color: "bg-orange-500",
    },
    {
      id: "3",
      user: "Marcus Johnson",
      userInitials: "MJ",
      action: "completed",
      habit: "Read 30 Min",
      xp: 20,
      icon: <Book className="w-4 h-4" />,
      timestamp: "12 min ago",
      color: "bg-purple-500",
    },
    {
      id: "4",
      user: "Emma Davis",
      userInitials: "ED",
      action: "achieved",
      habit: "30 Day Streak",
      xp: 100,
      icon: <Trophy className="w-4 h-4" />,
      timestamp: "18 min ago",
      color: "bg-yellow-500",
    },
    {
      id: "5",
      user: "David Park",
      userInitials: "DP",
      action: "completed",
      habit: "Team Meditation",
      xp: 25,
      icon: <Sparkles className="w-4 h-4" />,
      timestamp: "23 min ago",
      color: "bg-green-500",
    },
    {
      id: "6",
      user: "Lisa Wong",
      userInitials: "LW",
      action: "completed",
      habit: "Drink Water",
      xp: 10,
      icon: <Droplet className="w-4 h-4" />,
      timestamp: "31 min ago",
      color: "bg-cyan-500",
    },
    {
      id: "7",
      user: "James Wilson",
      userInitials: "JW",
      action: "completed",
      habit: "Morning Workout",
      xp: 15,
      icon: <Dumbbell className="w-4 h-4" />,
      timestamp: "45 min ago",
      color: "bg-red-500",
    },
  ])

  // Simulate new activities
  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity: Activity = {
        id: Date.now().toString(),
        user: ["Alex Rivera", "Sarah Chen", "Marcus Johnson"][Math.floor(Math.random() * 3)],
        userInitials: ["AR", "SC", "MJ"][Math.floor(Math.random() * 3)],
        action: "completed",
        habit: ["Drink Water", "Morning Workout", "Read 30 Min"][Math.floor(Math.random() * 3)],
        xp: [10, 15, 20][Math.floor(Math.random() * 3)],
        icon: [
          <Droplet key="d" className="w-4 h-4" />,
          <Dumbbell key="du" className="w-4 h-4" />,
          <Book key="b" className="w-4 h-4" />,
        ][Math.floor(Math.random() * 3)],
        timestamp: "Just now",
        color: ["bg-blue-500", "bg-orange-500", "bg-purple-500"][Math.floor(Math.random() * 3)],
      }

      setActivities((prev) => [newActivity, ...prev.slice(0, 9)])
    }, 15000) // New activity every 15 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="sticky top-4 h-[calc(100vh-8rem)] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Activity Feed
        </CardTitle>
        <CardDescription>Real-time squad updates</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full px-6 pb-6">
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors animate-in fade-in slide-in-from-top-2 duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Avatar className={`${activity.color} flex-shrink-0`}>
                  <AvatarFallback className="text-white text-xs font-semibold">{activity.userInitials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-medium text-foreground leading-tight">{activity.user}</p>
                    <Badge variant="secondary" className="text-xs flex-shrink-0">
                      +{activity.xp} XP
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="text-muted-foreground/80">{activity.icon}</span>
                    <span className="truncate">
                      {activity.action} "{activity.habit}"
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground/70 mt-1">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
