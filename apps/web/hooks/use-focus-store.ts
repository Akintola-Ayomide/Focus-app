"use client"
 
 import { useState, useEffect, useCallback } from "react"
 import { apiFetch } from "@/lib/api-client"
 import { useAuth } from "./use-auth"
 
 interface Session {
   id: string
   duration: number
   completedAt: string
 }
 
 export function useFocusStore() {
   const { user } = useAuth()
   const [sessions, setSessions] = useState<Session[]>([])
   const [mounted, setMounted] = useState(false)
   const [loading, setLoading] = useState(true)
 
   const fetchSessions = useCallback(async () => {
     if (!user) {
       setLoading(false)
       setMounted(true)
       return
     }
 
     try {
       const res = await apiFetch('/sessions')
       if (res.ok) {
         const data = await res.json()
         setSessions(data)
       }
     } catch (error) {
       console.error("Failed to fetch sessions:", error)
     } finally {
       setLoading(false)
       setMounted(true)
     }
   }, [user])
 
   useEffect(() => {
     fetchSessions()
   }, [fetchSessions])
 
   const addSession = useCallback(
     async (session: Omit<Session, "id">) => {
       if (!user) return
 
       try {
         const res = await apiFetch('/sessions', {
           method: 'POST',
           body: JSON.stringify(session),
         })
 
         if (res.ok) {
           const newSession = await res.json()
           setSessions((prev) => [newSession, ...prev])
         }
       } catch (error) {
         console.error("Failed to add session:", error)
       }
     },
     [user],
   )
 
   const deleteSession = useCallback(async (id: string) => {
     try {
       const res = await apiFetch(`/sessions/${id}`, {
         method: 'DELETE',
       })
 
       if (res.ok) {
         setSessions((prev) => prev.filter((s) => s.id !== id))
       }
     } catch (error) {
       console.error("Failed to delete session:", error)
     }
   }, [])
 
   return { sessions, addSession, deleteSession, loading, mounted }
 }
