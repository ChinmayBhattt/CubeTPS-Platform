import { useState, useEffect } from 'react'

interface TimerProps {
  isRunning: boolean
  onComplete: (time: number) => void
}

export default function Timer({ isRunning, onComplete }: TimerProps) {
  const [time, setTime] = useState(0)

  useEffect(() => {
    let intervalId: number

    if (isRunning) {
      const startTime = Date.now() - time * 1000
      intervalId = window.setInterval(() => {
        setTime((Date.now() - startTime) / 1000)
      }, 10)
    } else if (time > 0) {
      onComplete(time)
      setTime(0)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [isRunning, time, onComplete])

  return (
    <div className="font-mono text-2xl">
      {time.toFixed(2)}s
    </div>
  )
} 