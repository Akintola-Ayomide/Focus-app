"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import HabitForm from "@/components/habit-form"
import HabitList from "@/components/habit-list"
import { useHabitStore } from "@/hooks/use-habit-store"
import { Skeleton } from "@/components/ui/skeleton"

export default function HabitTrackerPage() {
  const { habits, addHabit, toggleHabitToday, deleteHabit, loading } = useHabitStore()
  const [showForm, setShowForm] = useState(false)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
          <Skeleton className="h-10 w-28" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Habit Tracker</h2>
          <p className="text-muted-foreground">Build consistency, one day at a time</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "+ Add Habit"}</Button>
      </div>

      {showForm && (
        <HabitForm
          onSubmit={async (habit) => {
            await addHabit(habit)
            setShowForm(false)
          }}
        />
      )}

      <HabitList habits={habits} onToggle={toggleHabitToday} onDelete={deleteHabit} />
    </div>
  )
}
