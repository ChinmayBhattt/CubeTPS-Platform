import { useEffect, useState } from 'react'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db, signInWithGoogle } from '../firebase'
import { motion } from 'framer-motion'

interface AuthProps {
  onAuthStateChange: (user: any) => void
}

export default function Auth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('Error signing in:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await auth.signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <div className="flex items-center gap-4">
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt={user.displayName || 'User'}
              className="w-8 h-8 rounded-full"
            />
          )}
          <span className="text-sm font-medium text-light">{user.displayName}</span>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <button
          onClick={handleSignIn}
          className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
        >
          Sign in with Google
        </button>
      )}
    </div>
  )
} 