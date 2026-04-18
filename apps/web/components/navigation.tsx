"use client"

import { Button } from "@/components/ui/button"

interface NavigationProps {
  currentPage: "home" | "timer" | "habits" | "insights"
  onPageChange: (page: "home" | "timer" | "habits" | "insights") => void
}

export default function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const navItems = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "timer", label: "Focus Timer", icon: "⏱" },
    { id: "habits", label: "Habits", icon: "✓" },
    { id: "insights", label: "Insights", icon: "📊" },
  ] as const

  return (
    <nav className="border-b border-border bg-card sticky top-0 z-40" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 overflow-x-auto py-4">
          {navItems.map((item) => (
            <Button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              variant={currentPage === item.id ? "default" : "outline"}
              className="whitespace-nowrap"
              aria-current={currentPage === item.id ? "page" : undefined}
              aria-label={`Navigate to ${item.label}`}
            >
              <span className="mr-2" aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  )
}
