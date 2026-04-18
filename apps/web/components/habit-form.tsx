"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface HabitFormProps {
  onSubmit: (habit: { name: string; color: string; icon: string }) => void
}

export default function HabitForm({ onSubmit }: HabitFormProps) {
  const [name, setName] = useState("")
  const [color, setColor] = useState("primary")
  const [icon, setIcon] = useState("✓")

  const colors = ["primary", "accent", "destructive"]
  const icons = ["✓", "💪", "📚", "🏃", "🧘", "💧", "🎯", "😴"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit({ name, color, icon })
      setName("")
      setColor("primary")
      setIcon("✓")
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Habit Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Morning Exercise"
            className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Icon</label>
          <div className="grid grid-cols-4 gap-2">
            {icons.map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIcon(i)}
                className={`p-3 rounded-lg border-2 text-xl transition-all ${
                  icon === i ? "border-primary bg-primary/10" : "border-border"
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="flex-1">
            Add Habit
          </Button>
        </div>
      </form>
    </Card>
  )
}
