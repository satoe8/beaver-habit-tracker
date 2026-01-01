"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { X, Sparkles } from "lucide-react"

interface PetModeProps {
  level: "seedling" | "kit" | "adult"
  equippedItems: string[]
  damTheme: string
  onClose: () => void
}

export default function PetMode({ level, equippedItems, damTheme, onClose }: PetModeProps) {
  const [position, setPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [beaverMood, setBeaverMood] = useState<"happy" | "excited" | "loved">("happy")
  const [showHearts, setShowHearts] = useState(false)
  const [damAnimation, setDamAnimation] = useState(0)
  const animationRef = useRef<number>()

  // Animate dam water ripples
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

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
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

  const handleBeaverClick = () => {
    setShowHearts(true)
    setBeaverMood("loved")
    setTimeout(() => {
      setShowHearts(false)
      setBeaverMood("happy")
    }, 2000)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, dragStart])

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

  const getDamStyles = () => {
    switch (damTheme) {
      case "dam-1": // Stone Dam
        return {
          bg: "bg-gradient-to-b from-slate-600 via-slate-700 to-slate-800",
          overlay: "🏔️",
          accent: "from-gray-400/20 to-gray-600/20",
        }
      case "dam-2": // Garden Dam
        return {
          bg: "bg-gradient-to-b from-green-400 via-green-600 to-green-800",
          overlay: "🌸",
          accent: "from-pink-300/30 to-green-500/30",
        }
      case "dam-3": // Winter Dam
        return {
          bg: "bg-gradient-to-b from-cyan-200 via-blue-300 to-blue-500",
          overlay: "❄️",
          accent: "from-white/40 to-cyan-300/40",
        }
      case "dam-4": // Sunset Dam
        return {
          bg: "bg-gradient-to-b from-orange-300 via-orange-500 to-purple-700",
          overlay: "🌅",
          accent: "from-yellow-400/30 to-orange-600/30",
        }
      case "dam-5": // Crystal Dam
        return {
          bg: "bg-gradient-to-b from-purple-400 via-pink-500 to-indigo-700",
          overlay: "💎",
          accent: "from-purple-300/40 to-pink-400/40",
        }
      default:
        return {
          bg: "bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900",
          overlay: "🌲",
          accent: "from-amber-500/20 to-brown-600/20",
        }
    }
  }

  const damStyles = getDamStyles()
  const accessories = getAccessoryEmojis()

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Dam Background */}
      <div className={`absolute inset-0 ${damStyles.bg}`}>
        {/* Animated water ripples */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`absolute inset-0 bg-gradient-radial ${damStyles.accent} opacity-60`}
            style={{
              transform: `scale(${1 + Math.sin(damAnimation * 0.02) * 0.1})`,
              transition: "transform 0.1s linear",
            }}
          />
          <div
            className={`absolute inset-0 bg-gradient-radial ${damStyles.accent} opacity-40`}
            style={{
              transform: `scale(${1 + Math.cos(damAnimation * 0.03) * 0.15})`,
              transition: "transform 0.1s linear",
            }}
          />
        </div>

        {/* Dam overlay emoji */}
        <div className="absolute bottom-8 right-8 text-[120px] opacity-20 pointer-events-none animate-pulse">
          {damStyles.overlay}
        </div>
        <div className="absolute top-8 left-8 text-[80px] opacity-15 pointer-events-none animate-pulse">
          {damStyles.overlay}
        </div>

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Close Button */}
      <Button
        size="lg"
        variant="outline"
        onClick={onClose}
        className="fixed top-4 right-4 z-10 bg-background/80 backdrop-blur-sm gap-2"
      >
        <X className="w-5 h-5" />
        Exit Pet Mode
      </Button>

      {/* Beaver */}
      <div
        className={`absolute ${isDragging ? "cursor-grabbing scale-110" : "cursor-grab"} transition-transform duration-200`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: "translate(-50%, -50%)",
          userSelect: "none",
        }}
        onMouseDown={handleMouseDown}
        onClick={handleBeaverClick}
      >
        <div className="relative">
          {/* Beaver with bounce animation */}
          <div className="text-[200px] leading-none animate-bounce-slow" style={{ animationDuration: "3s" }}>
            {getBeaverEmoji()}

            {/* Equipped accessories */}
            {accessories.map((emoji, index) => (
              <div
                key={index}
                className="absolute text-[100px] animate-wiggle"
                style={{
                  top: index === 0 ? "-50px" : `${-20 + index * 40}px`,
                  right: index === 0 ? "20px" : `${50 - index * 30}px`,
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                {emoji}
              </div>
            ))}
          </div>

          {/* Love hearts when clicked */}
          {showHearts && (
            <>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-4xl animate-float-up"
                  style={{
                    left: `${50 + (Math.random() - 0.5) * 100}px`,
                    top: "50px",
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  ❤️
                </div>
              ))}
            </>
          )}

          {/* Sparkles around beaver */}
          <div className="absolute -top-8 -right-8 animate-pulse">
            <Sparkles className="w-12 h-12 text-yellow-300 fill-yellow-300" />
          </div>
          <div className="absolute -bottom-8 -left-8 animate-pulse" style={{ animationDelay: "0.5s" }}>
            <Sparkles className="w-10 h-10 text-yellow-300 fill-yellow-300" />
          </div>
        </div>

        {/* Instruction tooltip */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap shadow-lg border border-border">
          Click to pet • Drag to move
        </div>
      </div>

      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-up {
          0% { transform: translateY(0px); opacity: 1; }
          100% { transform: translateY(-100px); opacity: 0; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-up {
          animation: float-up 1.5s ease-out forwards;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-wiggle {
          animation: wiggle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
