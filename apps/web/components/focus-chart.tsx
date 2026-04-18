"use client"

import { useMemo } from "react"
import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface Session {
  id: string
  duration: number
  completedAt: string
}

interface FocusChartProps {
  sessions: Session[]
}

export default function FocusChart({ sessions }: FocusChartProps) {
  const data = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date.toDateString()
    })

    return last7Days.map((day) => {
      const daySessions = sessions.filter((s) => new Date(s.completedAt).toDateString() === day)
      const totalMinutes = daySessions.reduce((sum, s) => sum + s.duration, 0)
      return {
        day: new Date(day).toLocaleDateString("en-US", { weekday: "short" }),
        minutes: totalMinutes,
        sessions: daySessions.length,
      }
    })
  }, [sessions])

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Focus Time (Last 7 Days)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="day" stroke="var(--muted-foreground)" />
          <YAxis stroke="var(--muted-foreground)" />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "var(--foreground)" }}
          />
          <Legend />
          <Bar dataKey="minutes" fill="var(--primary)" name="Minutes" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
