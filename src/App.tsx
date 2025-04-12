import { useState } from 'react'
import Auth from './components/Auth'
import WebcamView from './components/WebcamView'
import Leaderboard from './components/Leaderboard'
import { useSolve } from './hooks/useSolve'
import './App.css'

function App() {
  const { solveState, startSolve, stopSolve } = useSolve()

  const handleSolveComplete = (time: number, moves: number, accuracy: number) => {
    stopSolve(time, moves, accuracy)
  }

  return (
    <div className="min-h-screen bg-dark">
      <header className="bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-light">CubeRush</h1>
          <Auth />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-2xl font-semibold mb-4 text-light">Camera Preview</h2>
              <div className="aspect-video bg-black/20 rounded-lg overflow-hidden">
                <WebcamView 
                  isSolving={solveState.isSolving} 
                  onSolveComplete={handleSolveComplete} 
                />
              </div>
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => solveState.isSolving ? stopSolve(solveState.time, solveState.moves, solveState.accuracy) : startSolve()}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                    solveState.isSolving ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {solveState.isSolving ? 'Stop Solving' : 'Start Solving'}
                </button>
                <div className="text-2xl font-mono text-light">
                  {solveState.time.toFixed(2)}s
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-2xl font-semibold mb-4 text-light">Statistics</h2>
              <div className="space-y-4 text-light">
                <div className="flex justify-between">
                  <span>Best Time:</span>
                  <span className="font-mono">{solveState.time.toFixed(2)}s</span>
                </div>
                <div className="flex justify-between">
                  <span>Moves:</span>
                  <span className="font-mono">{solveState.moves}</span>
                </div>
                <div className="flex justify-between">
                  <span>Accuracy:</span>
                  <span className="font-mono">{solveState.accuracy}%</span>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <Leaderboard />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App 