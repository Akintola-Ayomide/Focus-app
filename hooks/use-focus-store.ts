"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"

interface Session {
  id: string
  duration: number
  completedAt: string
}

interface DbSession {
  id: string
  duration: number
  completed_at: string
  user_id: string
}

export function useFocusStore() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  const fetchSessions = useCallback(async () => {
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

    const { data, error } = await supabase
      .from("focus_sessions")
      .select("*")
      .order("completed_at", { ascending: false })

    if (error) {
      console.error("Failed to fetch sessions:", error)
    } else if (data) {
      const mappedSessions: Session[] = data.map((s: DbSession) => ({
        id: s.id,
        duration: s.duration,
        completedAt: s.completed_at,
      }))
      setSessions(mappedSessions)
    }

    setLoading(false)
    setMounted(true)
  }, [])

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  const addSession = useCallback(
    async (session: Omit<Session, "id">) => {
      if (!userId) return

      const supabase = createClient()
      const { data, error } = await supabase
        .from("focus_sessions")
        .insert({
          user_id: userId,
          duration: session.duration,
          completed_at: session.completedAt,
        })
        .select()
        .single()

      if (error) {
        console.error("Failed to add session:", error)
        return
      }

      if (data) {
        const newSession: Session = {
          id: data.id,
          duration: data.duration,
          completedAt: data.completed_at,
        }
        setSessions((prev) => [newSession, ...prev])
      }
    },
    [userId],
  )

  const deleteSession = useCallback(async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("focus_sessions").delete().eq("id", id)

    if (error) {
      console.error("Failed to delete session:", error)
      return
    }

    setSessions((prev) => prev.filter((s) => s.id !== id))
  }, [])

  return { sessions, addSession, deleteSession, loading, mounted }
}
