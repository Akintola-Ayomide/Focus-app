"use client"

import { Card } from "@/components/ui/card"
import FocusChart from "@/components/focus-chart"
import HabitChart from "@/components/habit-chart"
import { useFocusStore } from "@/hooks/use-focus-store"
import { useHabitStore } from "@/hooks/use-habit-store"

export default function InsightsPage() {
  const { sessions } = useFocusStore()
  const { habits } = useHabitStore()

  const totalSessions = sessions.length
  const totalFocusMinutes = sessions.reduce((sum, s) => sum + s.duration, 0)
  const avgSessionLength = totalSessions > 0 ? Math.round(totalFocusMinutes / totalSessions) : 0

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Total Sessions</p>
          <p className="text-3xl font-bold">{totalSessions}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Total Focus Time</p>
          <p className="text-3xl font-bold">
            {Math.round(totalFocusMinutes / 60)}h {totalFocusMinutes % 60}m
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Avg Session Length</p>
          <p className="text-3xl font-bold">{avgSessionLength}m</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FocusChart sessions={sessions} />
        <HabitChart habits={habits} />
      </div>
    </div>
  )
}
