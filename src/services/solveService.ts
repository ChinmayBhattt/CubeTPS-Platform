import { collection, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

export interface Solve {
  id?: string
  uid: string
  solveTime: number
  moves: number
  timestamp: number
  videoThumbnail?: string
}

export const saveSolve = async (solve: Solve) => {
  try {
    const solvesRef = collection(db, 'solves')
    const docRef = await addDoc(solvesRef, solve)
    return docRef.id
  } catch (error) {
    console.error('Error saving solve:', error)
    throw error
  }
}

export const getTopSolves = async (limitCount = 100) => {
  try {
    const solvesRef = collection(db, 'solves')
    const q = query(solvesRef, orderBy('solveTime', 'asc'), limit(limitCount))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Solve[]
  } catch (error) {
    console.error('Error fetching top solves:', error)
    throw error
  }
} 