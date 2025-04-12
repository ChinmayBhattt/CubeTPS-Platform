import { useState } from 'react'
import { auth } from '../firebase'
import { saveSolve } from '../services/solveService'

interface SolveState {
  isSolving: boolean
  time: number
  moves: number
  accuracy: number
}

export function useSolve() {
  const [solveState, setSolveState] = useState<SolveState>({
    isSolving: false,
    time: 0,
    moves: 0,
    accuracy: 0
  })

  const startSolve = () => {
    setSolveState({
      isSolving: true,
      time: 0,
      moves: 0,
      accuracy: 0
    })
  }

  const stopSolve = async (time: number, moves: number, accuracy: number) => {
    setSolveState({
      isSolving: false,
      time,
      moves,
      accuracy
    })

    const user = auth.currentUser
    if (user) {
      await saveSolve({
        uid: user.uid,
        solveTime: time,
        moves,
        timestamp: Date.now()
      })
    }
  }

  return {
    solveState,
    startSolve,
    stopSolve
  }
} 