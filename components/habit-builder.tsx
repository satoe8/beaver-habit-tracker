"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  X,
  Plus,
  Droplet,
  Dumbbell,
  Book,
  Moon,
  Apple,
  Coffee,
  Heart,
  Sparkles,
  Target,
  Brain,
  Zap,
  Leaf,
  Music,
  Smile,
  Trash2,
} from "lucide-react"
import type { Habit } from "./habit-dashboard"

interface HabitBuilderProps {
  isOpen: boolean
  onClose: () => void
  onCreateHabit: (habit: Omit<Habit, "id" | "completed" | "streak">) => void
  existingHabits: Habit[]
  onDeleteHabit: (id: string) => void
  onEditHabit: (id: string, updates: Partial<Habit>) => void
}

const iconOptions = [
  { name: "droplet", icon: <Droplet className="w-5 h-5" />, label: "Water" },
  { name: "dumbbell", icon: <Dumbbell className="w-5 h-5" />, label: "Exercise" },
  { name: "book", icon: <Book className="w-5 h-5" />, label: "Reading" },
  { name: "moon", icon: <Moon className="w-5 h-5" />, label: "Sleep" },
  { name: "apple", icon: <Apple className="w-5 h-5" />, label: "Nutrition" },
  { name: "coffee", icon: <Coffee className="w-5 h-5" />, label: "Coffee" },
  { name: "heart", icon: <Heart className="w-5 h-5" />, label: "Health" },
  { name: "sparkles", icon: <Sparkles className="w-5 h-5" />, label: "Meditation" },
  { name: "target", icon: <Target className="w-5 h-5" />, label: "Goal" },
  { name: "brain", icon: <Brain className="w-5 h-5" />, label: "Learning" },
  { name: "zap", icon: <Zap className="w-5 h-5" />, label: "Energy" },
  { name: "leaf", icon: <Leaf className="w-5 h-5" />, label: "Nature" },
  { name: "music", icon: <Music className="w-5 h-5" />, label: "Music" },
  { name: "smile", icon: <Smile className="w-5 h-5" />, label: "Happiness" },
]

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export default function HabitBuilder({
  isOpen,
  onClose,
  onCreateHabit,
  existingHabits,
  onDeleteHabit,
  onEditHabit,
}: HabitBuilderProps) {
  const [view, setView] = useState<"list" | "create">("list")
  const [habitName, setHabitName] = useState("")
  const [selectedIcon, setSelectedIcon] = useState("target")
  const [xpValue, setXpValue] = useState(10)
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "custom">("daily")
  const [selectedDays, setSelectedDays] = useState<number[]>([])

  if (!isOpen) return null

  const handleCreateHabit = () => {
    if (!habitName.trim()) return

    const iconOption = iconOptions.find((opt) => opt.name === selectedIcon) || iconOptions[0]

    onCreateHabit({
      name: habitName.trim(),
      icon: iconOption.icon,
      iconName: selectedIcon,
      xp: xpValue,
      frequency,
      customDays: frequency === "custom" ? selectedDays : undefined,
    })

    // Reset form
    setHabitName("")
    setSelectedIcon("target")
    setXpValue(10)
    setFrequency("daily")
    setSelectedDays([])
    setView("list")
  }

  const toggleDay = (dayIndex: number) => {
    setSelectedDays((prev) => (prev.includes(dayIndex) ? prev.filter((d) => d !== dayIndex) : [...prev, dayIndex]))
  }

  const getFrequencyLabel = (habit: Habit) => {
    if (habit.frequency === "daily") return "Daily"
    if (habit.frequency === "weekly") return "Weekly"
    if (habit.frequency === "custom" && habit.customDays) {
      return habit.customDays.map((d) => weekDays[d]).join(", ")
    }
    return "Custom"
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl">
        <CardHeader className="flex-shrink-0 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                {view === "list" ? "Manage Habits" : "Create New Habit"}
              </CardTitle>
              <CardDescription>
                {view === "list" ? "View, edit, or create custom habits" : "Customize your habit tracking"}
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-6">
          {view === "list" ? (
            <div className="space-y-4">
              <Button onClick={() => setView("create")} className="w-full" size="lg">
                <Plus className="w-4 h-4 mr-2" />
                Create New Habit
              </Button>

              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-3">
                  {existingHabits.map((habit) => (
                    <div
                      key={habit.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border border-border hover:bg-muted transition-colors"
                    >
                      <div className="flex-shrink-0 p-3 rounded-lg bg-primary/10 text-primary">{habit.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground mb-1">{habit.name}</h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            +{habit.xp} XP
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {getFrequencyLabel(habit)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{habit.streak} day streak</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteHabit(habit.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          ) : (
            <ScrollArea className="h-[550px] pr-4">
              <div className="space-y-6">
                {/* Habit Name */}
                <div className="space-y-2">
                  <Label htmlFor="habit-name">Habit Name</Label>
                  <Input
                    id="habit-name"
                    placeholder="e.g., Drink 8 glasses of water"
                    value={habitName}
                    onChange={(e) => setHabitName(e.target.value)}
                  />
                </div>

                {/* Icon Selection */}
                <div className="space-y-2">
                  <Label>Choose Icon</Label>
                  <div className="grid grid-cols-7 gap-2">
                    {iconOptions.map((option) => (
                      <button
                        key={option.name}
                        onClick={() => setSelectedIcon(option.name)}
                        className={`p-3 rounded-lg border transition-all ${
                          selectedIcon === option.name
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50 hover:bg-muted"
                        }`}
                        title={option.label}
                      >
                        {option.icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* XP Value */}
                <div className="space-y-2">
                  <Label htmlFor="xp-value">XP Reward</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="xp-value"
                      type="number"
                      min="5"
                      max="100"
                      value={xpValue}
                      onChange={(e) => setXpValue(Number(e.target.value))}
                      className="max-w-[120px]"
                    />
                    <span className="text-sm text-muted-foreground">Higher XP for more challenging habits</span>
                  </div>
                </div>

                {/* Frequency Selection */}
                <div className="space-y-3">
                  <Label>Frequency</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => {
                        setFrequency("daily")
                        setSelectedDays([])
                      }}
                      className={`p-4 rounded-lg border transition-all ${
                        frequency === "daily"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="font-semibold">Daily</div>
                      <div className="text-xs text-muted-foreground mt-1">Every day</div>
                    </button>
                    <button
                      onClick={() => {
                        setFrequency("weekly")
                        setSelectedDays([])
                      }}
                      className={`p-4 rounded-lg border transition-all ${
                        frequency === "weekly"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="font-semibold">Weekly</div>
                      <div className="text-xs text-muted-foreground mt-1">Once a week</div>
                    </button>
                    <button
                      onClick={() => setFrequency("custom")}
                      className={`p-4 rounded-lg border transition-all ${
                        frequency === "custom"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="font-semibold">Custom</div>
                      <div className="text-xs text-muted-foreground mt-1">Specific days</div>
                    </button>
                  </div>
                </div>

                {/* Custom Days Selection */}
                {frequency === "custom" && (
                  <div className="space-y-3">
                    <Label>Select Days</Label>
                    <div className="grid grid-cols-7 gap-2">
                      {weekDays.map((day, index) => (
                        <button
                          key={index}
                          onClick={() => toggleDay(index)}
                          className={`p-3 rounded-lg border transition-all ${
                            selectedDays.includes(index)
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="text-sm font-semibold">{day}</div>
                        </button>
                      ))}
                    </div>
                    {selectedDays.length === 0 && (
                      <p className="text-sm text-destructive">Please select at least one day</p>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setView("list")} className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateHabit}
                    disabled={!habitName.trim() || (frequency === "custom" && selectedDays.length === 0)}
                    className="flex-1"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Habit
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
