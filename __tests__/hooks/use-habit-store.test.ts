import { renderHook, act } from "@testing-library/react"
import { useHabitStore } from "@/hooks/use-habit-store"

const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
})

describe("useHabitStore", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("should initialize with empty habits", () => {
    const { result } = renderHook(() => useHabitStore())
    expect(result.current.habits).toEqual([])
  })

  it("should add a habit", () => {
    const { result } = renderHook(() => useHabitStore())

    act(() => {
      result.current.addHabit({
        name: "Morning Exercise",
        color: "primary",
        icon: "💪",
      })
    })

    expect(result.current.habits).toHaveLength(1)
    expect(result.current.habits[0].name).toBe("Morning Exercise")
  })

  it("should toggle habit completion", () => {
    const { result } = renderHook(() => useHabitStore())

    let habitId: string

    act(() => {
      result.current.addHabit({
        name: "Morning Exercise",
        color: "primary",
        icon: "💪",
      })
      habitId = result.current.habits[0].id
    })

    act(() => {
      result.current.toggleHabitToday(habitId!)
    })

    const today = new Date().toDateString()
    expect(result.current.habits[0].completedDates).toContain(today)
  })

  it("should delete a habit", () => {
    const { result } = renderHook(() => useHabitStore())

    let habitId: string

    act(() => {
      result.current.addHabit({
        name: "Morning Exercise",
        color: "primary",
        icon: "💪",
      })
      habitId = result.current.habits[0].id
    })

    act(() => {
      result.current.deleteHabit(habitId!)
    })

    expect(result.current.habits).toHaveLength(0)
  })
})
