"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import HomePage from "@/components/pages/home-page"
import FocusTimerPage from "@/components/pages/focus-timer-page"
import HabitTrackerPage from "@/components/pages/habit-tracker-page"
import InsightsPage from "@/components/pages/insights-page"
import ThemeToggle from "@/components/theme-toggle"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<"home" | "timer" | "habits" | "insights">("home")
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Initialize dark mode from localStorage
  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const shouldBeDark = savedTheme ? savedTheme === "dark" : prefersDark
    setIsDark(shouldBeDark)
    updateTheme(shouldBeDark)
  }, [])

  const updateTheme = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("theme", dark ? "dark" : "light")
  }

  const toggleTheme = () => {
    const newDark = !isDark
    setIsDark(newDark)
    updateTheme(newDark)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">⏱</span>
            </div>
            <h1 className="text-2xl font-bold">Focus Flow</h1>
          </div>
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
        </div>
      </header>

      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === "home" && <HomePage onNavigate={setCurrentPage} />}
        {currentPage === "timer" && <FocusTimerPage />}
        {currentPage === "habits" && <HabitTrackerPage />}
        {currentPage === "insights" && <InsightsPage />}
      </main>
    </div>
  )
}
