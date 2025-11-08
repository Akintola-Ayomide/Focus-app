"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import HabitForm from "@/components/habit-form"
import HabitList from "@/components/habit-list"
import { useHabitStore } from "@/hooks/use-habit-store"

export default function HabitTrackerPage() {
  const { habits, addHabit, toggleHabitToday, deleteHabit } = useHabitStore()
  const [showForm, setShowForm] = useState(false)

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
          onSubmit={(habit) => {
            addHabit(habit)
            setShowForm(false)
          }}
        />
      )}

      <HabitList habits={habits} onToggle={toggleHabitToday} onDelete={deleteHabit} />
    </div>
  )
}
