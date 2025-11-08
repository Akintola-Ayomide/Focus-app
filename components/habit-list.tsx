"use client"

import { useMemo, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Habit {
  id: string
  name: string
  color: string
  icon: string
  completedDates: string[]
}

interface HabitListProps {
  habits: Habit[]
  onToggle: (habitId: string) => void
  onDelete: (habitId: string) => void
}

export default function HabitList({ habits, onToggle, onDelete }: HabitListProps) {
  const today = new Date().toDateString()

  const calculateStreak = useCallback((completedDates: string[]): number => {
    if (completedDates.length === 0) return 0

    const sorted = completedDates.sort().reverse()
    let streak = 0
    const currentDate = new Date()

    for (const dateStr of sorted) {
      const date = new Date(dateStr)
      const expectedDate = new Date(currentDate)
      expectedDate.setDate(expectedDate.getDate() - streak)

      if (date.toDateString() === expectedDate.toDateString()) {
        streak++
      } else {
        break
      }
    }

    return streak
  }, [])

  const habitItems = useMemo(() => {
    return habits.map((habit) => {
      const isCompletedToday = habit.completedDates.includes(today)
      const streak = calculateStreak(habit.completedDates)

      return { habit, isCompletedToday, streak }
    })
  }, [habits, today, calculateStreak])

  if (habits.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground text-lg">No habits yet. Create your first habit to get started!</p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="list">
      {habitItems.map(({ habit, isCompletedToday, streak }) => (
        <Card key={habit.id} className="p-6" role="listitem">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl" aria-hidden="true">
                {habit.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{habit.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Streak: <span aria-label={`${streak} day streak`}>{streak}</span> days
                </p>
              </div>
            </div>
            <Button
              onClick={() => onDelete(habit.id)}
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              aria-label={`Delete ${habit.name} habit`}
            >
              ✕
            </Button>
          </div>

          <button
            onClick={() => onToggle(habit.id)}
            className={`w-full py-3 rounded-lg font-semibold transition-all ${
              isCompletedToday ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"
            }`}
            aria-pressed={isCompletedToday}
            aria-label={isCompletedToday ? `${habit.name} completed today` : `Mark ${habit.name} as complete`}
          >
            {isCompletedToday ? "✓ Completed Today" : "Mark Complete"}
          </button>
        </Card>
      ))}
    </div>
  )
}
