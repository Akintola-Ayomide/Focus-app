"use client"

import { useMemo } from "react"
import { Card } from "@/components/ui/card"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

interface Habit {
  id: string
  name: string
  color: string
  icon: string
  completedDates: string[]
}

interface HabitChartProps {
  habits: Habit[]
}

export default function HabitChart({ habits }: HabitChartProps) {
  const chartData = useMemo(() => {
    const today = new Date().toDateString()
    const completedToday = habits.filter((h) => h.completedDates.includes(today)).length
    const totalHabits = habits.length

    return [
      { name: "Completed", value: completedToday },
      { name: "Remaining", value: Math.max(0, totalHabits - completedToday) },
    ]
  }, [habits])

  const COLORS = ["var(--primary)", "var(--muted)"]

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Today's Habits</h3>
      {habits.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-muted-foreground">No habits tracked yet</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "var(--foreground)" }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
