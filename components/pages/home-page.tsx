"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useFocusStore } from "@/hooks/use-focus-store"
import { useHabitStore } from "@/hooks/use-habit-store"
import { Skeleton } from "@/components/ui/skeleton"
import { useMemo } from "react"

interface HomePageProps {
  onNavigate: (page: "timer" | "habits" | "insights") => void
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { sessions, loading: sessionsLoading } = useFocusStore()
  const { habits, loading: habitsLoading } = useHabitStore()

  const stats = useMemo(() => {
    const totalSessions = sessions.length
    const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0)
    const totalHours = Math.round((totalMinutes / 60) * 10) / 10
    const totalHabits = habits.length

    // Calculate completion rate for today
    const today = new Date().toDateString()
    const completedToday = habits.filter((h) => h.completedDates.includes(today)).length
    const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0

    return { totalSessions, totalHours, totalHabits, completionRate }
  }, [sessions, habits])

  const isLoading = sessionsLoading || habitsLoading

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-balance">Welcome to Focus Flow</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Manage your focus sessions, track daily habits, and visualize your productivity journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          className="p-6 hover:shadow-lg transition-shadow cursor-pointer focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
          role="button"
          tabIndex={0}
          onClick={() => onNavigate("timer")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              onNavigate("timer")
            }
          }}
        >
          <div className="text-4xl mb-4" aria-hidden="true">
            ⏱
          </div>
          <h2 className="text-xl font-semibold mb-2">Focus Timer</h2>
          <p className="text-muted-foreground mb-4">
            Use Pomodoro-style focus sessions to maintain deep work and track your productivity.
          </p>
          <Button variant="outline" className="w-full bg-transparent" aria-label="Start a focus session">
            Start Session
          </Button>
        </Card>

        <Card
          className="p-6 hover:shadow-lg transition-shadow cursor-pointer focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
          role="button"
          tabIndex={0}
          onClick={() => onNavigate("habits")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              onNavigate("habits")
            }
          }}
        >
          <div className="text-4xl mb-4" aria-hidden="true">
            ✓
          </div>
          <h2 className="text-xl font-semibold mb-2">Habit Tracker</h2>
          <p className="text-muted-foreground mb-4">
            Build and maintain daily habits. Track your consistency and celebrate your progress.
          </p>
          <Button variant="outline" className="w-full bg-transparent" aria-label="Track your daily habits">
            Track Habits
          </Button>
        </Card>

        <Card
          className="p-6 hover:shadow-lg transition-shadow cursor-pointer focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
          role="button"
          tabIndex={0}
          onClick={() => onNavigate("insights")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              onNavigate("insights")
            }
          }}
        >
          <div className="text-4xl mb-4" aria-hidden="true">
            📊
          </div>
          <h2 className="text-xl font-semibold mb-2">Insights</h2>
          <p className="text-muted-foreground mb-4">
            Visualize your productivity trends and see how your habits impact your focus time.
          </p>
          <Button variant="outline" className="w-full bg-transparent" aria-label="View your productivity analytics">
            View Analytics
          </Button>
        </Card>
      </div>

      <Card className="p-8 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <h2 className="text-2xl font-bold mb-4">Quick Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            {isLoading ? (
              <Skeleton className="h-9 w-16 mb-1" />
            ) : (
              <div className="text-3xl font-bold text-primary">{stats.totalSessions}</div>
            )}
            <p className="text-sm text-muted-foreground">Focus Sessions</p>
          </div>
          <div>
            {isLoading ? (
              <Skeleton className="h-9 w-16 mb-1" />
            ) : (
              <div className="text-3xl font-bold text-primary">{stats.totalHours}</div>
            )}
            <p className="text-sm text-muted-foreground">Hours Focused</p>
          </div>
          <div>
            {isLoading ? (
              <Skeleton className="h-9 w-16 mb-1" />
            ) : (
              <div className="text-3xl font-bold text-primary">{stats.totalHabits}</div>
            )}
            <p className="text-sm text-muted-foreground">Habits Tracked</p>
          </div>
          <div>
            {isLoading ? (
              <Skeleton className="h-9 w-16 mb-1" />
            ) : (
              <div className="text-3xl font-bold text-primary">{stats.completionRate}%</div>
            )}
            <p className="text-sm text-muted-foreground">Completion Rate</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
