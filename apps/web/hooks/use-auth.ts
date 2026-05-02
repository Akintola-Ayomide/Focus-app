"use client"

import { useState, useEffect, useCallback } from "react"
import { apiFetch } from "@/lib/api-client"

interface User {
  id: string
  email: string
  display_name?: string | null
}

interface Profile {
  id: string
  email: string | null
  display_name: string | null
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await apiFetch('/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setProfile(data.user) // Assuming user object has profile info or is the same for now
      } else {
        setUser(null)
        setProfile(null)
      }
    } catch (error) {
      console.error("Failed to fetch current user:", error)
      setUser(null)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCurrentUser()
  }, [fetchCurrentUser])

  const signOut = useCallback(async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' })
      setUser(null)
      setProfile(null)
    } catch (error) {
      console.error("Failed to sign out:", error)
    }
  }, [])

  const login = useCallback((userData: User) => {
    setUser(userData)
    setProfile(userData as any)
  }, [])

  return { user, profile, loading, signOut, login }
}
