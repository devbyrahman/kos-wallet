import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { supabase } from '../services/supabase'

/**
 * AUTHENTICATION CONTEXT & HOOK
 * 
 * Why this exists:
 * In a modern React app, user details need to be accessible from many parts of the application
 * (e.g. Dashboard to display the student name, adding transactions to record who owns them).
 * A React Context Provider acts like a "global broadcast tower" that distributes the current user state
 * to any component tuned into it.
 * 
 * Beginner Concept - Context API:
 * - `createContext()` creates the context object.
 * - `useContext(AuthContext)` extracts the values provided by it.
 * - `AuthProvider` wraps our app and passes down state.
 */

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [initializing, setInitializing] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)
  const [error, setError] = useState(null)

  // Safeguard: Track the current active user ID in a mutable ref.
  // This allows asynchronous callbacks to check if the user is still active before updating state.
  const activeUserRef = useRef(null)

  useEffect(() => {
    activeUserRef.current = user
  }, [user])

  // Fetch the public profile associated with a user ID from our PostgreSQL profiles table
  const fetchProfile = async (userId) => {
    if (!userId) return
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error

      // Safeguard: Only update profile if the user ID matches the currently active user ref.
      // This prevents out-of-order stale background network responses from corrupting the UI!
      if (activeUserRef.current?.id === userId) {
        setProfile(data)
      }
    } catch (err) {
      console.error('Error fetching profile:', err.message)
      // If profile fetch fails, set fallback profile
      if (activeUserRef.current?.id === userId) {
        setProfile({ full_name: 'Student Anak Kos' })
      }
    }
  }

  useEffect(() => {
    let active = true

    // 1. Check current active session when the app loads
    const initSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError

        if (session?.user) {
          if (active) {
            setUser(session.user)
            // Update ref immediately so that fetchProfile's safeguard works on startup
            activeUserRef.current = session.user
            await fetchProfile(session.user.id)
          }
        } else {
          if (active) {
            setUser(null)
            setProfile(null)
          }
        }
      } catch (err) {
        console.error('Session initialization error:', err.message)
        if (active) {
          setUser(null)
          setProfile(null)
        }
      } finally {
        if (active) {
          setInitializing(false)
        }
      }
    }

    initSession()

    // 2. Listen to real-time auth events (Sign In, Sign Out, Token Refresh, User Updated)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        try {
          // Skip the INITIAL_SESSION event since our initSession() handles it explicitly
          if (event === 'INITIAL_SESSION') {
            return
          }

          if (active) {
            if (session?.user) {
              setUser(session.user)
              // Update ref immediately for the safeguard
              activeUserRef.current = session.user

              // Only fetch the profile if the user actually signed in or updated.
              // We NEVER touch the global "initializing" state here.
              // Background token refreshes (TOKEN_REFRESHED) will update state silently,
              // completely eliminating any tab-switching deadlock or UI flashes!
              // We invoke this as a non-blocking floating promise to keep the observer lightweight.
              if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
                fetchProfile(session.user.id).catch((err) => {
                  console.error('Error in profile fetch promise inside auth listener:', err.message)
                })
              }
            } else {
              setUser(null)
              setProfile(null)
            }
          }
        } catch (err) {
          console.error('Auth state change listener error:', err.message)
        }
      }
    )

    // Cleanup our auth subscription when the component unmounts to prevent memory leaks!
    return () => {
      active = false
      subscription?.unsubscribe()
    }
  }, [])

  /**
   * Register a new student account
   * 
   * @param {string} email 
   * @param {string} password 
   * @param {string} fullName 
   * @returns {Object} { data, error }
   */
  const signUp = async (email, password, fullName) => {
    setError(null)
    setAuthLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })
      if (error) throw error
      return { data, error: null }
    } catch (err) {
      setError(err.message)
      return { data: null, error: err.message }
    } finally {
      setAuthLoading(false)
    }
  }

  /**
   * Log into an existing student account
   * 
   * @param {string} email 
   * @param {string} password 
   * @returns {Object} { data, error }
   */
  const signIn = async (email, password) => {
    setError(null)
    setAuthLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      return { data, error: null }
    } catch (err) {
      setError(err.message)
      return { data: null, error: err.message }
    } finally {
      setAuthLoading(false)
    }
  }

  /**
   * Log out of the current session
   */
  const signOut = async () => {
    setError(null)
    setAuthLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (err) {
      setError(err.message)
    } finally {
      setAuthLoading(false)
    }
  }

  const value = {
    user,
    profile,
    initializing,
    authLoading,
    error,
    signUp,
    signIn,
    signOut,
    refreshProfile: () => fetchProfile(user?.id),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to make utilizing auth simple in any component: `const { user, signIn } = useAuth()`
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider! Make sure to wrap your main layout.')
  }
  return context
}
