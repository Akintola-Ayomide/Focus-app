"use client"

import { useState, useEffect } from "react"

interface Habit {
  id: string
  name: string
  color: string
  icon: string
  completedDates: string[]
}

export function useHabitStore() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [mounted, setMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("habits")
    if (saved) {
      try {
        setHabits(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load habits:", e)
      }
    }
    setMounted(true)
  }, [])

  // Save to localStorage whenever habits change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("habits", JSON.stringify(habits))
    }
  }, [habits, mounted])

  const addHabit = (habit: Omit<Habit, "id" | "completedDates">) => {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
      completedDates: [],
    }
    setHabits((prev) => [...prev, newHabit])
  }

  const toggleHabitToday = (habitId: string) => {
    const today = new Date().toDateString()
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id === habitId) {
          const isCompleted = habit.completedDates.includes(today)
          return {
            ...habit,
            completedDates: isCompleted
              ? habit.completedDates.filter((d) => d !== today)
              : [...habit.completedDates, today],
          }
        }
        return habit
      }),
    )
  }

  const deleteHabit = (habitId: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId))
  }

  return { habits, addHabit, toggleHabitToday, deleteHabit }
}
