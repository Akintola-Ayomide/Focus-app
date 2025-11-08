import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import FocusTimer from "@/components/focus-timer"
import { jest } from "@jest/globals"

describe("FocusTimer", () => {
  it("renders the timer with initial 25 minutes", () => {
    const mockOnComplete = jest.fn()
    render(<FocusTimer onSessionComplete={mockOnComplete} />)

    expect(screen.getByText("25:00")).toBeInTheDocument()
  })

  it("starts the timer when Start button is clicked", async () => {
    const mockOnComplete = jest.fn()
    render(<FocusTimer onSessionComplete={mockOnComplete} />)

    const startButton = screen.getByText("Start")
    fireEvent.click(startButton)

    await waitFor(() => {
      expect(screen.getByText("Pause")).toBeInTheDocument()
    })
  })

  it("pauses the timer when Pause button is clicked", async () => {
    const mockOnComplete = jest.fn()
    render(<FocusTimer onSessionComplete={mockOnComplete} />)

    const startButton = screen.getByText("Start")
    fireEvent.click(startButton)

    await waitFor(() => {
      const pauseButton = screen.getByText("Pause")
      fireEvent.click(pauseButton)
      expect(screen.getByText("Start")).toBeInTheDocument()
    })
  })

  it("resets the timer when Reset button is clicked", () => {
    const mockOnComplete = jest.fn()
    render(<FocusTimer onSessionComplete={mockOnComplete} />)

    const resetButton = screen.getByText("Reset")
    fireEvent.click(resetButton)

    expect(screen.getByText("25:00")).toBeInTheDocument()
  })

  it("allows changing session duration", () => {
    const mockOnComplete = jest.fn()
    render(<FocusTimer onSessionComplete={mockOnComplete} />)

    const fifteenMinButton = screen.getByText("15m")
    fireEvent.click(fifteenMinButton)

    expect(screen.getByText("15:00")).toBeInTheDocument()
  })
})
