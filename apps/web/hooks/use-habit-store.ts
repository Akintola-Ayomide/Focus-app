"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"

interface Habit {
  id: string
  name: string
  color: string
  icon: string
  completedDates: string[]
}

interface DbHabit {
  id: string
  name: string
  color: string
  icon: string
  user_id: string
}

interface DbHabitCompletion {
  id: string
  habit_id: string
  completed_date: string
  user_id: string
}

export function useHabitStore() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  const fetchHabits = useCallback(async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setLoading(false)
      setMounted(true)
      return
    }

    setUserId(user.id)

    // Fetch habits
    const { data: habitsData, error: habitsError } = await supabase
      .from("habits")
      .select("*")
      .order("created_at", { ascending: true })

    if (habitsError) {
      console.error("Failed to fetch habits:", habitsError)
      setLoading(false)
      setMounted(true)
      return
    }

    // Fetch all habit completions
    const { data: completionsData, error: completionsError } = await supabase.from("habit_completions").select("*")

    if (completionsError) {
      console.error("Failed to fetch completions:", completionsError)
    }

    // Map habits with their completed dates
    const mappedHabits: Habit[] = (habitsData || []).map((h: DbHabit) => {
      const habitCompletions = (completionsData || [])
        .filter((c: DbHabitCompletion) => c.habit_id === h.id)
        .map((c: DbHabitCompletion) => new Date(c.completed_date).toDateString())

      return {
        id: h.id,
        name: h.name,
        color: h.color,
        icon: h.icon,
        completedDates: habitCompletions,
      }
    })

    setHabits(mappedHabits)
    setLoading(false)
    setMounted(true)
  }, [])

  useEffect(() => {
    fetchHabits()
  }, [fetchHabits])

  const addHabit = useCallback(
    async (habit: Omit<Habit, "id" | "completedDates">) => {
      if (!userId) return

      const supabase = createClient()
      const { data, error } = await supabase
        .from("habits")
        .insert({
          user_id: userId,
          name: habit.name,
          color: habit.color,
          icon: habit.icon,
        })
        .select()
        .single()

      if (error) {
        console.error("Failed to add habit:", error)
        return
      }

      if (data) {
        const newHabit: Habit = {
          id: data.id,
          name: data.name,
          color: data.color,
          icon: data.icon,
          completedDates: [],
        }
        setHabits((prev) => [...prev, newHabit])
      }
    },
    [userId],
  )

  const toggleHabitToday = useCallback(
    async (habitId: string) => {
      if (!userId) return

      const supabase = createClient()
      const today = new Date()
      const todayString = today.toDateString()
      const todayIso = today.toISOString().split("T")[0]

      const habit = habits.find((h) => h.id === habitId)
      if (!habit) return

      const isCompleted = habit.completedDates.includes(todayString)

      if (isCompleted) {
        // Remove completion
        const { error } = await supabase
          .from("habit_completions")
          .delete()
          .eq("habit_id", habitId)
          .eq("completed_date", todayIso)

        if (error) {
          console.error("Failed to remove completion:", error)
          return
        }

        setHabits((prev) =>
          prev.map((h) => {
            if (h.id === habitId) {
              return {
                ...h,
                completedDates: h.completedDates.filter((d) => d !== todayString),
              }
            }
            return h
          }),
        )
      } else {
        // Add completion
        const { error } = await supabase.from("habit_completions").insert({
          habit_id: habitId,
          user_id: userId,
          completed_date: todayIso,
        })

        if (error) {
          console.error("Failed to add completion:", error)
          return
        }

        setHabits((prev) =>
          prev.map((h) => {
            if (h.id === habitId) {
              return {
                ...h,
                completedDates: [...h.completedDates, todayString],
              }
            }
            return h
          }),
        )
      }
    },
    [userId, habits],
  )

  const deleteHabit = useCallback(async (habitId: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("habits").delete().eq("id", habitId)

    if (error) {
      console.error("Failed to delete habit:", error)
      return
    }

    setHabits((prev) => prev.filter((h) => h.id !== habitId))
  }, [])

  return { habits, addHabit, toggleHabitToday, deleteHabit, loading, mounted }
}
