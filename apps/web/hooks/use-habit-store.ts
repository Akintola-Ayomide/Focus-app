"use client"
 
 import { useState, useEffect, useCallback } from "react"
 import { apiFetch } from "@/lib/api-client"
 import { useAuth } from "./use-auth"
 
 interface Habit {
   id: string
   name: string
   color: string
   icon: string
   completedDates: string[]
 }
 
 interface ApiHabit {
   id: string
   name: string
   color: string
   icon: string
   logs: { completedDate: string }[]
 }
 
 export function useHabitStore() {
   const { user } = useAuth()
   const [habits, setHabits] = useState<Habit[]>([])
   const [mounted, setMounted] = useState(false)
   const [loading, setLoading] = useState(true)
 
   const fetchHabits = useCallback(async () => {
     if (!user) {
       setLoading(false)
       setMounted(true)
       return
     }
 
     try {
       const res = await apiFetch('/habits')
       if (res.ok) {
         const data: ApiHabit[] = await res.json()
         
         const mappedHabits: Habit[] = data.map((h) => ({
           id: h.id,
           name: h.name,
           color: h.color,
           icon: h.icon,
           completedDates: h.logs.map(log => new Date(log.completedDate).toDateString()),
         }))
 
         setHabits(mappedHabits)
       }
     } catch (error) {
       console.error("Failed to fetch habits:", error)
     } finally {
       setLoading(false)
       setMounted(true)
     }
   }, [user])
 
   useEffect(() => {
     fetchHabits()
   }, [fetchHabits])
 
   const addHabit = useCallback(
     async (habit: Omit<Habit, "id" | "completedDates">) => {
       if (!user) return
 
       try {
         const res = await apiFetch('/habits', {
           method: 'POST',
           body: JSON.stringify(habit),
         })
 
         if (res.ok) {
           const newApiHabit: ApiHabit = await res.json()
           const newHabit: Habit = {
             id: newApiHabit.id,
             name: newApiHabit.name,
             color: newApiHabit.color,
             icon: newApiHabit.icon,
             completedDates: [],
           }
           setHabits((prev) => [...prev, newHabit])
         }
       } catch (error) {
         console.error("Failed to add habit:", error)
       }
     },
     [user],
   )
 
   const toggleHabitToday = useCallback(
     async (habitId: string) => {
       if (!user) return
 
       const today = new Date()
       const todayString = today.toDateString()
       const todayIso = today.toISOString().split("T")[0]
 
       try {
         const res = await apiFetch(`/habits/${habitId}/toggle`, {
           method: 'POST',
           body: JSON.stringify({ completedDate: todayIso }),
         })
 
         if (res.ok) {
           const { status } = await res.json()
           
           setHabits((prev) =>
             prev.map((h) => {
               if (h.id === habitId) {
                 return {
                   ...h,
                   completedDates: status === 'completed' 
                     ? [...h.completedDates, todayString]
                     : h.completedDates.filter((d) => d !== todayString),
                 }
               }
               return h
             }),
           )
         }
       } catch (error) {
         console.error("Failed to toggle habit:", error)
       }
     },
     [user],
   )
 
   const deleteHabit = useCallback(async (habitId: string) => {
     try {
       const res = await apiFetch(`/habits/${habitId}`, {
         method: 'DELETE',
       })
 
       if (res.ok) {
         setHabits((prev) => prev.filter((h) => h.id !== habitId))
       }
     } catch (error) {
       console.error("Failed to delete habit:", error)
     }
   }, [])
 
   return { habits, addHabit, toggleHabitToday, deleteHabit, loading, mounted }
 }
