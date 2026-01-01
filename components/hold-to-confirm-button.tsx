"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface HoldToConfirmButtonProps {
  onComplete: () => void
  disabled?: boolean
  completed?: boolean
  duration?: number
}

export default function HoldToConfirmButton({
  onComplete,
  disabled = false,
  completed = false,
  duration = 2000,
}: HoldToConfirmButtonProps) {
  const [isHolding, setIsHolding] = useState(false)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const handleStart = () => {
    if (disabled || completed) return

    setIsHolding(true)
    startTimeRef.current = Date.now()

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      const newProgress = Math.min((elapsed / duration) * 100, 100)
      setProgress(newProgress)

      if (newProgress >= 100) {
        handleComplete()
      }
    }, 10)
  }

  const handleEnd = () => {
    setIsHolding(false)
    setProgress(0)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const handleComplete = () => {
    handleEnd()
    onComplete()
  }

  if (completed) {
    return (
      <Button size="lg" disabled className="relative bg-accent hover:bg-accent text-accent-foreground gap-2">
        <CheckCircle2 className="w-5 h-5" />
        Done
      </Button>
    )
  }

  return (
    <Button
      size="lg"
      disabled={disabled}
      className={cn("relative overflow-hidden transition-all duration-200", isHolding && "scale-95")}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
    >
      {/* Progress Background */}
      <div
        className="absolute inset-0 bg-accent/30 transition-all duration-100"
        style={{
          width: `${progress}%`,
          transition: progress === 0 ? "none" : "width 100ms linear",
        }}
      />

      {/* Button Content */}
      <span className="relative flex items-center gap-2">
        <Circle className="w-5 h-5" />
        {isHolding ? "Hold..." : "Hold to Complete"}
      </span>
    </Button>
  )
}
