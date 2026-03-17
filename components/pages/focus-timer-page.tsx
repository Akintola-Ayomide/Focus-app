"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import FocusTimer from "@/components/focus-timer"
import SessionHistory from "@/components/session-history"
import { useFocusStore } from "@/hooks/use-focus-store"
import { Skeleton } from "@/components/ui/skeleton"

export default function FocusTimerPage() {
  const { sessions, addSession, loading } = useFocusStore()
  const [isRunning, setIsRunning] = useState(false)

  const handleSessionComplete = async (duration: number) => {
    await addSession({
      duration,
      completedAt: new Date().toISOString(),
    })
    setIsRunning(false)
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-[150px] w-full rounded-xl" />
          </div>
        </div>
        <Skeleton className="h-[200px] w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FocusTimer onSessionComplete={handleSessionComplete} />
        </div>

        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Today&apos;s Stats</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Sessions Completed</p>
                <p className="text-2xl font-bold">
                  {
                    sessions.filter((s) => {
                      const today = new Date().toDateString()
                      return new Date(s.completedAt).toDateString() === today
                    }).length
                  }
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Focus Time</p>
                <p className="text-2xl font-bold">
                  {Math.round(
                    sessions
                      .filter((s) => {
                        const today = new Date().toDateString()
                        return new Date(s.completedAt).toDateString() === today
                      })
                      .reduce((sum, s) => sum + s.duration, 0),
                  )}
                  m
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <SessionHistory sessions={sessions} />
    </div>
  )
}
