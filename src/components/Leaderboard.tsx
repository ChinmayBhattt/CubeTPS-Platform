import { useEffect, useState } from 'react'
import { getTopSolves } from '../services/solveService'
import type { Solve } from '../services/solveService'

export default function Leaderboard() {
  const [solves, setSolves] = useState<Solve[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const leaderboard = await getTopSolves()
        setSolves(leaderboard)
      } catch (err) {
        setError('Failed to load leaderboard')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  if (loading) {
    return (
      <div className="card">
        <div className="h-8 w-8 mx-auto animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    )
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-semibold mb-4 text-light">Top Solves</h2>
      {solves.length > 0 ? (
        <div className="space-y-2">
          {solves.map((solve, index) => (
            <div
              key={solve.id}
              className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono text-light/80">#{index + 1}</span>
                <div className="text-light">
                  <div className="font-medium">{solve.solveTime.toFixed(2)}s</div>
                  <div className="text-sm text-light/60">{new Date(solve.timestamp).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="text-sm text-light/80">
                {solve.moves} moves
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-light/60 py-8">
          No solves recorded yet
        </div>
      )}
    </div>
  )
} 