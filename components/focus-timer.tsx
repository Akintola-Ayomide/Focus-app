"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface FocusTimerProps {
  onSessionComplete: (duration: number) => void
}

export default function FocusTimer({ onSessionComplete }: FocusTimerProps) {
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionDuration, setSessionDuration] = useState(25)
  const [isBreak, setIsBreak] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds > 0) {
            return prevSeconds - 1
          } else if (minutes > 0) {
            setMinutes((prevMinutes) => prevMinutes - 1)
            return 59
          } else {
            // Session complete
            setIsRunning(false)
            if (!isBreak) {
              onSessionComplete(sessionDuration)
              // Auto-start break
              setIsBreak(true)
              setMinutes(5)
              return 0
            } else {
              // Break complete
              setIsBreak(false)
              setMinutes(25)
              return 0
            }
          }
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isRunning, minutes, isBreak, sessionDuration, onSessionComplete])

  const handleStart = useCallback(() => setIsRunning(true), [])
  const handlePause = useCallback(() => setIsRunning(false), [])
  const handleReset = useCallback(() => {
    setIsRunning(false)
    setIsBreak(false)
    setMinutes(25)
    setSeconds(0)
  }, [])

  const handleSetDuration = useCallback(
    (duration: number) => {
      if (!isRunning) {
        setSessionDuration(duration)
        setMinutes(duration)
        setSeconds(0)
      }
    },
    [isRunning],
  )

  const displayMinutes = useMemo(() => String(minutes).padStart(2, "0"), [minutes])
  const displaySeconds = useMemo(() => String(seconds).padStart(2, "0"), [seconds])

  const progress = useMemo(() => {
    return isBreak
      ? ((5 * 60 - (minutes * 60 + seconds)) / (5 * 60)) * 100
      : ((sessionDuration * 60 - (minutes * 60 + seconds)) / (sessionDuration * 60)) * 100
  }, [isBreak, minutes, seconds, sessionDuration])

  const statusText = isBreak ? "Break Time" : "Focus Session"

  return (
    <Card className="p-8 space-y-8">
      <div className="text-center space-y-4">
        <p className="text-lg font-semibold text-muted-foreground" role="status" aria-live="polite">
          {statusText}
        </p>
        <div className="relative w-64 h-64 mx-auto">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200" aria-hidden="true">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-muted opacity-20"
            />
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary transition-all duration-300"
              strokeDasharray={`${(progress / 100) * 565.48} 565.48`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div
                className="text-6xl font-bold font-mono"
                aria-label={`${displayMinutes} minutes ${displaySeconds} seconds remaining`}
              >
                {displayMinutes}:{displaySeconds}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        {!isRunning ? (
          <Button onClick={handleStart} size="lg" className="px-8" aria-label="Start the focus timer">
            Start
          </Button>
        ) : (
          <Button
            onClick={handlePause}
            size="lg"
            variant="outline"
            className="px-8 bg-transparent"
            aria-label="Pause the focus timer"
          >
            Pause
          </Button>
        )}
        <Button
          onClick={handleReset}
          size="lg"
          variant="outline"
          className="px-8 bg-transparent"
          aria-label="Reset the focus timer"
        >
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[15, 25, 45].map((duration) => (
          <Button
            key={duration}
            onClick={() => handleSetDuration(duration)}
            variant={sessionDuration === duration && !isRunning ? "default" : "outline"}
            disabled={isRunning}
            className="w-full"
            aria-label={`Set focus duration to ${duration} minutes`}
            aria-pressed={sessionDuration === duration && !isRunning}
          >
            {duration}m
          </Button>
        ))}
      </div>
    </Card>
  )
}
