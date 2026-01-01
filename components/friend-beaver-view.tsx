"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { X, Bell, Sparkles, Heart, Trophy } from "lucide-react"

interface Friend {
  id: string
  name: string
  initials: string
  color: string
  level: "seedling" | "kit" | "adult"
  xp: number
  online: boolean
  equippedItems?: string[]
  damTheme?: string
}

interface FriendBeaverViewProps {
  friend: Friend
  onClose: () => void
  onNudge: (friendId: string) => void
}

export default function FriendBeaverView({ friend, onClose, onNudge }: FriendBeaverViewProps) {
  const [hasNudged, setHasNudged] = useState(false)
  const [showNudgeEffect, setShowNudgeEffect] = useState(false)

  const handleNudge = () => {
    setHasNudged(true)
    setShowNudgeEffect(true)
    onNudge(friend.id)
    setTimeout(() => setShowNudgeEffect(false), 2000)
    setTimeout(() => setHasNudged(false), 10000) // Can nudge again after 10 seconds
  }

  const getBeaverEmoji = () => {
    switch (friend.level) {
      case "seedling":
        return "🌱"
      case "kit":
        return "🦫"
      case "adult":
        return "🦫✨"
      default:
        return "🦫"
    }
  }

  const getAccessoryEmojis = () => {
    const accessories: string[] = []
    friend.equippedItems?.forEach((itemId) => {
      if (itemId === "hat-1") accessories.push("🎩")
      if (itemId === "hat-2") accessories.push("🎉")
      if (itemId === "hat-3") accessories.push("👑")
      if (itemId === "acc-1") accessories.push("😎")
      if (itemId === "acc-2") accessories.push("🎀")
      if (itemId === "acc-3") accessories.push("🏅")
    })
    return accessories
  }

  const getDamStyles = () => {
    switch (friend.damTheme) {
      case "dam-1":
        return {
          bg: "bg-gradient-to-b from-slate-600 via-slate-700 to-slate-800",
          overlay: "🏔️",
        }
      case "dam-2":
        return {
          bg: "bg-gradient-to-b from-green-400 via-green-600 to-green-800",
          overlay: "🌸",
        }
      case "dam-3":
        return {
          bg: "bg-gradient-to-b from-cyan-200 via-blue-300 to-blue-500",
          overlay: "❄️",
        }
      case "dam-4":
        return {
          bg: "bg-gradient-to-b from-orange-300 via-orange-500 to-purple-700",
          overlay: "🌅",
        }
      case "dam-5":
        return {
          bg: "bg-gradient-to-b from-purple-400 via-pink-500 to-indigo-700",
          overlay: "💎",
        }
      default:
        return {
          bg: "bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900",
          overlay: "🌲",
        }
    }
  }

  const damStyles = getDamStyles()
  const accessories = getAccessoryEmojis()

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 border border-border overflow-hidden">
        {/* Header */}
        <div className="bg-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className={`${friend.color} w-12 h-12`}>
                  <AvatarFallback className="text-white font-semibold">{friend.initials}</AvatarFallback>
                </Avatar>
                {friend.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-card rounded-full" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{friend.name}</h2>
                <p className="text-sm text-muted-foreground capitalize">
                  {friend.level} Beaver • {friend.xp} XP
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <CardContent className="p-0">
          {/* Dam Background with Beaver */}
          <div className={`relative h-96 ${damStyles.bg} overflow-hidden`}>
            {/* Dam overlay emoji */}
            <div className="absolute bottom-8 right-8 text-[100px] opacity-20 pointer-events-none animate-pulse">
              {damStyles.overlay}
            </div>
            <div className="absolute top-8 left-8 text-[70px] opacity-15 pointer-events-none animate-pulse">
              {damStyles.overlay}
            </div>

            {/* Nudge effect ripples */}
            {showNudgeEffect && (
              <>
                <div className="absolute inset-0 bg-yellow-400/30 animate-ping" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl animate-bounce">👋</div>
                </div>
              </>
            )}

            {/* Beaver in center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`relative ${showNudgeEffect ? "animate-wiggle-strong" : ""}`}>
                <div className="text-[150px] leading-none animate-bounce-slow" style={{ animationDuration: "3s" }}>
                  {getBeaverEmoji()}

                  {/* Equipped accessories */}
                  {accessories.map((emoji, index) => (
                    <div
                      key={index}
                      className="absolute text-[75px] animate-wiggle"
                      style={{
                        top: index === 0 ? "-40px" : `${-15 + index * 30}px`,
                        right: index === 0 ? "15px" : `${40 - index * 25}px`,
                        animationDelay: `${index * 0.2}s`,
                      }}
                    >
                      {emoji}
                    </div>
                  ))}
                </div>

                {/* Sparkles */}
                <div className="absolute -top-6 -right-6 animate-pulse">
                  <Sparkles className="w-10 h-10 text-yellow-300 fill-yellow-300" />
                </div>
                <div className="absolute -bottom-6 -left-6 animate-pulse" style={{ animationDelay: "0.5s" }}>
                  <Sparkles className="w-8 h-8 text-yellow-300 fill-yellow-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats and Actions */}
          <div className="p-6 space-y-4 bg-card">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-muted/50 border-border">
                <CardContent className="p-4 text-center">
                  <Trophy className="w-6 h-6 mx-auto mb-2 text-accent" />
                  <p className="text-2xl font-bold text-foreground">{friend.xp}</p>
                  <p className="text-xs text-muted-foreground">Total XP</p>
                </CardContent>
              </Card>
              <Card className="bg-muted/50 border-border">
                <CardContent className="p-4 text-center">
                  <Sparkles className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold text-foreground capitalize">{friend.level}</p>
                  <p className="text-xs text-muted-foreground">Level</p>
                </CardContent>
              </Card>
              <Card className="bg-muted/50 border-border">
                <CardContent className="p-4 text-center">
                  <Heart className="w-6 h-6 mx-auto mb-2 text-destructive" />
                  <p className="text-2xl font-bold text-foreground">{friend.online ? "Online" : "Offline"}</p>
                  <p className="text-xs text-muted-foreground">Status</p>
                </CardContent>
              </Card>
            </div>

            {/* Nudge Button */}
            <Button
              onClick={handleNudge}
              disabled={hasNudged}
              size="lg"
              className="w-full gap-2"
              variant={hasNudged ? "outline" : "default"}
            >
              <Bell className="w-5 h-5" />
              {hasNudged ? "Nudged! They'll get notified" : "Send a Nudge"}
            </Button>

            <p className="text-xs text-center text-muted-foreground leading-relaxed">
              Send a friendly nudge to encourage {friend.name.split(" ")[0]} to complete their habits!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes wiggle {
          0%,
          100% {
            transform: rotate(-5deg);
          }
          50% {
            transform: rotate(5deg);
          }
        }
        @keyframes wiggle-strong {
          0%,
          100% {
            transform: rotate(-15deg) scale(1);
          }
          50% {
            transform: rotate(15deg) scale(1.1);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-wiggle {
          animation: wiggle 2s ease-in-out infinite;
        }
        .animate-wiggle-strong {
          animation: wiggle-strong 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}
