"use client"

import { useState, useEffect } from "react"

interface Session {
  id: string
  duration: number
  completedAt: string
}

export function useFocusStore() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [mounted, setMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("focus-sessions")
    if (saved) {
      try {
        setSessions(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load sessions:", e)
      }
    }
    setMounted(true)
  }, [])

  // Save to localStorage whenever sessions change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("focus-sessions", JSON.stringify(sessions))
    }
  }, [sessions, mounted])

  const addSession = (session: Session) => {
    setSessions((prev) => [...prev, session])
  }

  const deleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id))
  }

  return { sessions, addSession, deleteSession }
}
