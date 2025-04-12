import * as tf from '@tensorflow/tfjs'
import * as handpose from '@tensorflow-models/handpose'
import { ColorDetector } from './colorDetection'

interface CubeState {
  isSolving: boolean
  isComplete: boolean
  moveCount: number
  confidence: number
  cubePosition: { x: number; y: number; width: number; height: number } | null
  faceColors: Record<string, number>
}

export class CubeDetector {
  private handPoseModel: handpose.HandPose | null = null
  private colorDetector: ColorDetector
  private lastCubePosition: { x: number; y: number; width: number; height: number } | null = null
  private moveThreshold = 0.2
  private lastHandPosition: { x: number; y: number } | null = null

  constructor() {
    this.colorDetector = new ColorDetector()
  }

  async initialize() {
    try {
      await this.colorDetector.initialize()
      this.handPoseModel = await handpose.load()
    } catch (error) {
      console.error('Error initializing cube detector:', error)
      throw error
    }
  }

  private calculateOverlap(
    rect1: { x: number; y: number; width: number; height: number },
    rect2: { x: number; y: number; width: number; height: number }
  ): number {
    const xOverlap = Math.max(0, Math.min(rect1.x + rect1.width, rect2.x + rect2.width) - Math.max(rect1.x, rect2.x))
    const yOverlap = Math.max(0, Math.min(rect1.y + rect1.height, rect2.y + rect2.height) - Math.max(rect1.y, rect2.y))
    const overlapArea = xOverlap * yOverlap
    const rect1Area = rect1.width * rect1.height
    return overlapArea / rect1Area
  }

  private isCubeSolved(faceColors: Record<string, number>): boolean {
    return this.colorDetector.isFaceSolved(faceColors)
  }

  private trackMove(currentPosition: { x: number; y: number }): boolean {
    if (!this.lastHandPosition) {
      this.lastHandPosition = currentPosition
      return false
    }

    const dx = currentPosition.x - this.lastHandPosition.x
    const dy = currentPosition.y - this.lastHandPosition.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    this.lastHandPosition = currentPosition
    return distance > this.moveThreshold
  }

  async detectCube(video: HTMLVideoElement): Promise<CubeState> {
    if (!this.handPoseModel) {
      throw new Error('HandPose model not initialized')
    }

    const predictions = await this.handPoseModel.estimateHands(video)
    const state: CubeState = {
      isSolving: false,
      isComplete: false,
      moveCount: 0,
      confidence: 0,
      cubePosition: null,
      faceColors: {}
    }

    if (predictions.length > 0) {
      const hand = predictions[0]
      const bbox = hand.boundingBox
      
      // Get the region of interest for color detection
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const imageData = ctx.getImageData(bbox.topLeft[0], bbox.topLeft[1], bbox.bottomRight[0] - bbox.topLeft[0], bbox.bottomRight[1] - bbox.topLeft[1])
        state.faceColors = this.colorDetector.detectColors(imageData)
      }

      // Update cube position
      state.cubePosition = {
        x: bbox.topLeft[0],
        y: bbox.topLeft[1],
        width: bbox.bottomRight[0] - bbox.topLeft[0],
        height: bbox.bottomRight[1] - bbox.topLeft[1]
      }

      // Check if cube is being moved
      const handCenter = {
        x: (bbox.topLeft[0] + bbox.bottomRight[0]) / 2,
        y: (bbox.topLeft[1] + bbox.bottomRight[1]) / 2
      }

      if (this.trackMove(handCenter)) {
        state.moveCount++
      }

      // Check if cube is solved
      state.isComplete = this.isCubeSolved(state.faceColors)
      state.isSolving = !state.isComplete && state.moveCount > 0
      state.confidence = hand.handInViewConfidence
    }

    this.lastCubePosition = state.cubePosition
    return state
  }
}

export function calculateAccuracy(moves: number, optimalMoves: number): number {
  if (moves === 0) return 0
  return Math.min(100, Math.round((optimalMoves / moves) * 100))
} 