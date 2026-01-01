"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, Trophy } from "lucide-react"

export default function SharedGoalCard() {
  const contributors = [
    { name: "You", initials: "ME", color: "bg-primary", contribution: 40 },
    { name: "Alex", initials: "AR", color: "bg-blue-500", contribution: 35 },
    { name: "Sarah", initials: "SC", color: "bg-purple-500", contribution: 25 },
  ]

  const totalProgress = contributors.reduce((sum, c) => sum + c.contribution, 0)
  const goal = 100

  return (
    <Card className="border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-primary/5">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-primary" />
              Squad Challenge
            </CardTitle>
            <CardDescription>100 Total Habits This Week</CardDescription>
          </div>
          <Badge variant="outline" className="bg-accent/10 border-accent text-accent-foreground">
            <Trophy className="w-3 h-3 mr-1" />
            150 XP
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-foreground">
              {totalProgress} / {goal} habits
            </span>
            <span className="text-muted-foreground">{Math.round((totalProgress / goal) * 100)}%</span>
          </div>
          <Progress value={(totalProgress / goal) * 100} className="h-3" />
        </div>

        {/* Contributors */}
        <div className="space-y-3 pt-2">
          <p className="text-sm font-medium text-muted-foreground">Contributors</p>
          {contributors.map((contributor, index) => (
            <div key={index} className="flex items-center gap-3">
              <Avatar className={`${contributor.color} flex-shrink-0`}>
                <AvatarFallback className="text-white text-xs font-semibold">{contributor.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{contributor.name}</span>
                  <span className="text-sm text-muted-foreground">{contributor.contribution} habits</span>
                </div>
                <Progress value={(contributor.contribution / goal) * 100} className="h-1.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Reward Info */}
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            🎉 Everyone gets <span className="font-semibold text-accent-foreground">+150 XP</span> when the goal is
            reached!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
