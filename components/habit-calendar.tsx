"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, ChevronLeft, ChevronRight, CalendarIcon, Edit2, CheckCircle2 } from "lucide-react"
import type { Habit } from "./habit-dashboard"

interface HabitCalendarProps {
  isOpen: boolean
  onClose: () => void
  habits: Habit[]
  onEditHabit: (id: string, updates: Partial<Habit>) => void
}

interface DayHabitCustomization {
  habitId: string
  date: string
  customName?: string
  customXP?: number
  skipped?: boolean
}

export default function HabitCalendar({ isOpen, onClose, habits, onEditHabit }: HabitCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null)
  const [customizations, setCustomizations] = useState<DayHabitCustomization[]>([])
  const [editMode, setEditMode] = useState(false)
  const [customName, setCustomName] = useState("")
  const [customXP, setCustomXP] = useState(10)

  if (!isOpen) return null

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate)

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(year, month, day)
    setSelectedDate(clickedDate)
    setSelectedHabit(null)
    setEditMode(false)
  }

  const handleHabitClick = (habit: Habit) => {
    setSelectedHabit(habit)
    setCustomName(habit.name)
    setCustomXP(habit.xp)
    setEditMode(true)
  }

  const handleSaveCustomization = () => {
    if (!selectedDate || !selectedHabit) return

    const dateString = selectedDate.toISOString().split("T")[0]
    const customization: DayHabitCustomization = {
      habitId: selectedHabit.id,
      date: dateString,
      customName: customName !== selectedHabit.name ? customName : undefined,
      customXP: customXP !== selectedHabit.xp ? customXP : undefined,
    }

    setCustomizations((prev) => {
      const filtered = prev.filter((c) => !(c.habitId === selectedHabit.id && c.date === dateString))
      return [...filtered, customization]
    })

    setEditMode(false)
    setSelectedHabit(null)
  }

  const getCustomization = (habitId: string, date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return customizations.find((c) => c.habitId === habitId && c.date === dateString)
  }

  const isToday = (day: number) => {
    const today = new Date()
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year
  }

  const isSelected = (day: number) => {
    if (!selectedDate) return false
    return selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year
  }

  const shouldShowHabit = (habit: Habit, day: number) => {
    const date = new Date(year, month, day)
    const dayOfWeek = date.getDay()

    if (habit.frequency === "daily") return true
    if (habit.frequency === "weekly") return true
    if (habit.frequency === "custom" && habit.customDays) {
      return habit.customDays.includes(dayOfWeek)
    }
    return true
  }

  const getHabitsForSelectedDate = () => {
    if (!selectedDate) return []
    const day = selectedDate.getDate()
    return habits.filter((habit) => shouldShowHabit(habit, day))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl">
        <CardHeader className="flex-shrink-0 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                Habit Calendar
              </CardTitle>
              <CardDescription>View and customize your habits for specific days</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Calendar View */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {/* Calendar Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-foreground">
                    {monthNames[month]} {year}
                  </h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={goToNextMonth}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="border border-border rounded-lg overflow-hidden">
                  {/* Week Days Header */}
                  <div className="grid grid-cols-7 bg-muted">
                    {weekDays.map((day) => (
                      <div key={day} className="p-2 text-center text-sm font-semibold text-muted-foreground">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7">
                    {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                      <div
                        key={`empty-${index}`}
                        className="aspect-square border-t border-r border-border bg-muted/20"
                      />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, index) => {
                      const day = index + 1
                      const hasHabits = habits.some((h) => shouldShowHabit(h, day))
                      const completedCount = habits.filter(
                        (h) => shouldShowHabit(h, day) && h.completed && isToday(day),
                      ).length
                      const totalHabitsForDay = habits.filter((h) => shouldShowHabit(h, day)).length

                      return (
                        <button
                          key={day}
                          onClick={() => handleDayClick(day)}
                          className={`aspect-square border-t border-r border-border p-2 hover:bg-muted/50 transition-colors ${
                            isToday(day) ? "bg-primary/5 border-primary/30" : ""
                          } ${isSelected(day) ? "bg-accent/20 border-accent" : ""}`}
                        >
                          <div className="flex flex-col items-center justify-center h-full">
                            <span
                              className={`text-sm font-semibold mb-1 ${
                                isToday(day) ? "text-primary" : "text-foreground"
                              }`}
                            >
                              {day}
                            </span>
                            {hasHabits && (
                              <div className="flex gap-0.5">
                                {Array.from({ length: Math.min(totalHabitsForDay, 3) }).map((_, i) => (
                                  <div
                                    key={i}
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      isToday(day) && i < completedCount ? "bg-accent" : "bg-muted-foreground/30"
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Day Details Panel */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {selectedDate
                      ? `${monthNames[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`
                      : "Select a Date"}
                  </CardTitle>
                  <CardDescription>
                    {selectedDate ? "Habits scheduled for this day" : "Click on a day to view details"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedDate ? (
                    <ScrollArea className="h-[500px] pr-4">
                      {editMode && selectedHabit ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-foreground">Customize Habit</h3>
                            <Button variant="ghost" size="sm" onClick={() => setEditMode(false)}>
                              Cancel
                            </Button>
                          </div>

                          <div className="space-y-3">
                            <div className="space-y-2">
                              <Label htmlFor="custom-name">Habit Name</Label>
                              <Input
                                id="custom-name"
                                value={customName}
                                onChange={(e) => setCustomName(e.target.value)}
                                placeholder="Custom habit name for this day"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="custom-xp">XP Reward</Label>
                              <Input
                                id="custom-xp"
                                type="number"
                                min="5"
                                max="100"
                                value={customXP}
                                onChange={(e) => setCustomXP(Number(e.target.value))}
                              />
                            </div>

                            <Button onClick={handleSaveCustomization} className="w-full">
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Save Customization
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {getHabitsForSelectedDate().length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">
                              No habits scheduled for this day
                            </p>
                          ) : (
                            getHabitsForSelectedDate().map((habit) => {
                              const customization = getCustomization(habit.id, selectedDate)
                              const displayName = customization?.customName || habit.name
                              const displayXP = customization?.customXP || habit.xp

                              return (
                                <div
                                  key={habit.id}
                                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border hover:bg-muted transition-colors"
                                >
                                  <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10 text-primary">
                                    {habit.icon}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-foreground text-sm truncate">{displayName}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="outline" className="text-xs">
                                        +{displayXP} XP
                                      </Badge>
                                      {customization && (
                                        <Badge variant="secondary" className="text-xs">
                                          Custom
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleHabitClick(habit)}
                                    className="flex-shrink-0"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              )
                            })
                          )}
                        </div>
                      )}
                    </ScrollArea>
                  ) : (
                    <div className="flex items-center justify-center h-[500px]">
                      <div className="text-center">
                        <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">Select a day to view and customize habits</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
