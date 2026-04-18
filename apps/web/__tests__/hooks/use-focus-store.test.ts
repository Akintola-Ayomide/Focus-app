import { renderHook, act } from "@testing-library/react"
import { useFocusStore } from "@/hooks/use-focus-store"

// Mock localStorage
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

describe("useFocusStore", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("should initialize with empty sessions", () => {
    const { result } = renderHook(() => useFocusStore())
    expect(result.current.sessions).toEqual([])
  })

  it("should add a session", () => {
    const { result } = renderHook(() => useFocusStore())

    act(() => {
      result.current.addSession({
        id: "1",
        duration: 25,
        completedAt: new Date().toISOString(),
      })
    })

    expect(result.current.sessions).toHaveLength(1)
    expect(result.current.sessions[0].duration).toBe(25)
  })

  it("should delete a session", () => {
    const { result } = renderHook(() => useFocusStore())

    act(() => {
      result.current.addSession({
        id: "1",
        duration: 25,
        completedAt: new Date().toISOString(),
      })
    })

    act(() => {
      result.current.deleteSession("1")
    })

    expect(result.current.sessions).toHaveLength(0)
  })

  it("should persist sessions to localStorage", () => {
    const { result } = renderHook(() => useFocusStore())

    act(() => {
      result.current.addSession({
        id: "1",
        duration: 25,
        completedAt: new Date().toISOString(),
      })
    })

    const stored = localStorage.getItem("focus-sessions")
    expect(stored).toBeTruthy()
    const parsed = JSON.parse(stored!)
    expect(parsed).toHaveLength(1)
  })
})
