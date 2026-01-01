"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Heart, Move, RotateCcw } from "lucide-react"
import { useEffect, useState, useRef } from "react"

interface BeaverAvatarProps {
  level: "seedling" | "kit" | "adult"
  xp: number
  equippedItems?: string[]
  damTheme?: string
}

export default function BeaverAvatar({ level, xp, equippedItems = [], damTheme = "default" }: BeaverAvatarProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [previousXP, setPreviousXP] = useState(xp)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const beaverRef = useRef<HTMLDivElement>(null)
  const [damAnimation, setDamAnimation] = useState(0)
  const animationRef = useRef<number>()

  useEffect(() => {
    const animate = () => {
      setDamAnimation((prev) => (prev + 1) % 360)
      animationRef.current = requestAnimationFrame(animate)
    }
    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  useEffect(() => {
    if (xp > previousXP) {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 600)
    }
    setPreviousXP(xp)
  }, [xp, previousXP])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement && e.target.closest(".beaver-emoji")) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.target instanceof HTMLElement && e.target.closest(".beaver-emoji")) {
      const touch = e.touches[0]
      setIsDragging(true)
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      })
    }
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging && e.touches[0]) {
      const touch = e.touches[0]
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      })
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const handleReset = () => {
    setPosition({ x: 0, y: 0 })
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
      window.addEventListener("touchmove", handleTouchMove)
      window.addEventListener("touchend", handleTouchEnd)

      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
        window.removeEventListener("touchmove", handleTouchMove)
        window.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [isDragging, dragStart, position])

  const getBeaverEmoji = () => {
    switch (level) {
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

  const getBeaverMessage = () => {
    switch (level) {
      case "seedling":
        return "I'm just sprouting! Keep going!"
      case "kit":
        return "I'm growing strong with your habits!"
      case "adult":
        return "Together we built an amazing colony!"
      default:
        return "Let's build something great!"
    }
  }

  const getAccessoryEmojis = () => {
    const accessories: string[] = []
    equippedItems.forEach((itemId) => {
      if (itemId === "hat-1") accessories.push("🎩")
      if (itemId === "hat-2") accessories.push("🎉")
      if (itemId === "hat-3") accessories.push("👑")
      if (itemId === "acc-1") accessories.push("😎")
      if (itemId === "acc-2") accessories.push("🎀")
      if (itemId === "acc-3") accessories.push("🏅")
    })
    return accessories
  }

  const getDamBackground = () => {
    switch (damTheme) {
      case "dam-1": // Stone Dam
        return {
          gradient: "bg-gradient-to-br from-slate-500 via-slate-700 to-slate-900",
          overlayEmoji: "🏔️",
          accentColor: "from-gray-400/20 to-gray-600/30",
        }
      case "dam-2": // Garden Dam
        return {
          gradient: "bg-gradient-to-br from-green-300 via-green-600 to-green-900",
          overlayEmoji: "🌸",
          accentColor: "from-pink-300/30 to-green-500/40",
        }
      case "dam-3": // Winter Dam
        return {
          gradient: "bg-gradient-to-br from-cyan-100 via-blue-400 to-blue-700",
          overlayEmoji: "❄️",
          accentColor: "from-white/50 to-cyan-300/50",
        }
      case "dam-4": // Sunset Dam
        return {
          gradient: "bg-gradient-to-br from-orange-200 via-orange-500 to-purple-800",
          overlayEmoji: "🌅",
          accentColor: "from-yellow-400/40 to-orange-600/40",
        }
      case "dam-5": // Crystal Dam
        return {
          gradient: "bg-gradient-to-br from-purple-300 via-pink-500 to-indigo-800",
          overlayEmoji: "💎",
          accentColor: "from-purple-300/50 to-pink-400/50",
        }
      default:
        return {
          gradient: "",
          overlayEmoji: null,
          accentColor: "",
        }
    }
  }

  const damBg = getDamBackground()
  const accessories = getAccessoryEmojis()

  return (
    <Card className="relative overflow-hidden border border-border bg-card shadow-sm">
      {damTheme !== "default" ? (
        <div className={`absolute inset-0 ${damBg.gradient} pointer-events-none`}>
          <div className="absolute inset-0 overflow-hidden">
            <div
              className={`absolute inset-0 bg-gradient-radial ${damBg.accentColor} opacity-60 transition-transform duration-100`}
              style={{
                transform: `scale(${1 + Math.sin(damAnimation * 0.02) * 0.1})`,
              }}
            />
            <div
              className={`absolute inset-0 bg-gradient-radial ${damBg.accentColor} opacity-40 transition-transform duration-100`}
              style={{
                transform: `scale(${1 + Math.cos(damAnimation * 0.03) * 0.15})`,
              }}
            />
          </div>
          {damBg.overlayEmoji && (
            <>
              <div className="absolute bottom-6 right-6 text-6xl opacity-15 animate-pulse pointer-events-none">
                {damBg.overlayEmoji}
              </div>
              <div className="absolute top-6 left-6 text-4xl opacity-10 animate-pulse pointer-events-none">
                {damBg.overlayEmoji}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="/wooden-beaver-dam-by-a-forest-river-with-logs-and-.jpg"
            alt="Dam background"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
      )}

      <CardContent className="p-8 relative">
        {(position.x !== 0 || position.y !== 0) && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            className="absolute top-4 right-4 z-10 gap-1.5 bg-background/80 backdrop-blur-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Position
          </Button>
        )}

        <div className="text-center">
          <div
            ref={beaverRef}
            className={`beaver-emoji relative inline-block transition-transform duration-300 ${
              isAnimating ? "scale-110 animate-bounce" : "animate-idle-sway"
            } ${isDragging ? "cursor-grabbing scale-105 z-50" : "cursor-grab"} group`}
            style={{
              transform: `translate(${position.x}px, ${position.y}px)`,
              userSelect: "none",
              WebkitUserSelect: "none",
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <div className="text-[120px] leading-none mb-4 relative">
              {getBeaverEmoji()}

              {accessories.map((emoji, index) => (
                <div
                  key={index}
                  className="absolute text-[60px] animate-wiggle"
                  style={{
                    top: index === 0 ? "-30px" : `${-10 + index * 25}px`,
                    right: index === 0 ? "10px" : `${30 - index * 20}px`,
                    animationDelay: `${index * 0.3}s`,
                    animationDuration: "2.5s",
                  }}
                >
                  {emoji}
                </div>
              ))}

              {isAnimating && (
                <div className="absolute -top-4 -right-4 animate-bounce">
                  <Sparkles className="w-8 h-8 text-accent fill-accent" />
                </div>
              )}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-foreground/90 text-background px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 whitespace-nowrap shadow-lg">
                  <Move className="w-3.5 h-3.5" />
                  Drag me around!
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <h3 className="text-2xl font-bold text-foreground capitalize">{level} Beaver</h3>
            <p className="text-muted-foreground max-w-sm mx-auto text-balance leading-relaxed">{getBeaverMessage()}</p>

            <div className="flex items-center justify-center gap-2 pt-2">
              {[...Array(level === "adult" ? 5 : level === "kit" ? 4 : 3)].map((_, i) => (
                <Heart
                  key={i}
                  className="w-5 h-5 text-destructive fill-destructive animate-heart-beat"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="absolute top-4 left-4 opacity-10 pointer-events-none animate-pulse">
          <Sparkles className="w-12 h-12 text-primary" />
        </div>
        <div
          className="absolute bottom-4 right-4 opacity-10 pointer-events-none animate-pulse"
          style={{ animationDelay: "0.7s" }}
        >
          <Sparkles className="w-8 h-8 text-accent" />
        </div>
      </CardContent>

      <style jsx>{`
        @keyframes idle-sway {
          0%,
          100% {
            transform: translateX(0px) rotate(0deg);
          }
          50% {
            transform: translateX(3px) rotate(2deg);
          }
        }
        @keyframes wiggle {
          0%,
          100% {
            transform: rotate(-8deg);
          }
          50% {
            transform: rotate(8deg);
          }
        }
        @keyframes heart-beat {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
        }
        .animate-idle-sway {
          animation: idle-sway 3s ease-in-out infinite;
        }
        .animate-wiggle {
          animation: wiggle 2.5s ease-in-out infinite;
        }
        .animate-heart-beat {
          animation: heart-beat 1.5s ease-in-out infinite;
        }
      `}</style>
    </Card>
  )
}
