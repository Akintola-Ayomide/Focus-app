"use client"

import { useMemo } from "react"
import { Card } from "@/components/ui/card"

interface Session {
  id: string
  duration: number
  completedAt: string
}

interface SessionHistoryProps {
  sessions: Session[]
}

export default function SessionHistory({ sessions }: SessionHistoryProps) {
  const recentSessions = useMemo(() => {
    return sessions.slice(-10).reverse()
  }, [sessions])

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Recent Sessions</h3>
      {recentSessions.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No sessions yet. Start your first focus session!</p>
      ) : (
        <div className="space-y-2">
          {recentSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">{session.duration} minute session</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(session.completedAt).toLocaleDateString()} at{" "}
                  {new Date(session.completedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-primary">{session.duration}m</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
