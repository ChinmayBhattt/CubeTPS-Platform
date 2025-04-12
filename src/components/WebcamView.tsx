import { useRef, useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import { CubeDetector } from '../utils/cubeDetection'

interface WebcamViewProps {
  isSolving: boolean
  onSolveComplete: (time: number, moves: number, accuracy: number) => void
}

export default function WebcamView({ isSolving, onSolveComplete }: WebcamViewProps) {
  const webcamRef = useRef<Webcam>(null)
  const [cubeDetector, setCubeDetector] = useState<CubeDetector | null>(null)
  const [isModelLoading, setIsModelLoading] = useState(true)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    async function initializeDetector() {
      try {
        const detector = new CubeDetector()
        await detector.initialize()
        setCubeDetector(detector)
        setIsModelLoading(false)
      } catch (error) {
        console.error('Error initializing cube detector:', error)
        setIsModelLoading(false)
      }
    }

    initializeDetector()
  }, [])

  useEffect(() => {
    let animationFrameId: number

    async function detectCube() {
      if (!webcamRef.current || !cubeDetector || !isSolving) return

      const video = webcamRef.current.video
      if (!video) return

      try {
        const state = await cubeDetector.detectCube(video)

        // Start timer when cube is first detected
        if (state.isSolving && !startTimeRef.current) {
          startTimeRef.current = Date.now()
        }

        // Stop timer and complete solve when cube is solved
        if (state.isComplete && startTimeRef.current) {
          const solveTime = (Date.now() - startTimeRef.current) / 1000
          onSolveComplete(solveTime, state.moveCount, state.confidence * 100)
          startTimeRef.current = null
          return
        }

        animationFrameId = requestAnimationFrame(detectCube)
      } catch (error) {
        console.error('Error detecting cube:', error)
      }
    }

    if (isSolving) {
      detectCube()
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [isSolving, cubeDetector, onSolveComplete])

  return (
    <div className="relative w-full h-full">
      <Webcam
        ref={webcamRef}
        className="w-full h-full object-cover"
        mirrored
        audio={false}
      />
      {isModelLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-light">Loading AI models...</div>
        </div>
      )}
    </div>
  )
} 