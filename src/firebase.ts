import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { getFirestore, collection, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  try {
    const result = await signInWithPopup(auth, provider)
    return result.user
  } catch (error) {
    console.error('Error signing in with Google:', error)
    throw error
  }
}

export const saveSolve = async (solve: {
  uid: string
  solveTime: number
  moves: number
  timestamp: number
  videoThumbnail?: string
}) => {
  try {
    const solvesRef = collection(db, 'solves')
    await addDoc(solvesRef, solve)
  } catch (error) {
    console.error('Error saving solve:', error)
    throw error
  }
}

export const getLeaderboard = async (limit = 100) => {
  try {
    const solvesRef = collection(db, 'solves')
    const q = query(solvesRef, orderBy('solveTime', 'asc'), limit(limit))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    throw error
  }
} 