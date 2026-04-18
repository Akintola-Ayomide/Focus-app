"use client"

import { Button } from "@/components/ui/button"

interface ThemeToggleProps {
  isDark: boolean
  onToggle: () => void
}

export default function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <Button
      onClick={onToggle}
      variant="outline"
      size="icon"
      className="rounded-lg bg-transparent"
      aria-label="Toggle theme"
    >
      {isDark ? "☀️" : "🌙"}
    </Button>
  )
}
