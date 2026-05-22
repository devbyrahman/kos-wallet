import React from 'react'
import { useAuth } from './hooks/useAuth'
import { useLanguage } from './hooks/useLanguage'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import { Loader2, Wallet } from 'lucide-react'

/**
 * MAIN APP CONTAINER (Router & Controller)
 * 
 * Why this component exists:
 * The single entry point for our layout. It acts as our basic, ultra-clean "routing" system.
 * Rather than importing complex router libraries, we use state-based rendering.
 * 
 * Flow Details:
 * 1. Checks `loading` from `useAuth()`. If true, displays a highly aesthetic full-screen loading spinner.
 * 2. Checks `user` from `useAuth()`. If null (unauthenticated), redirects to the `Auth` (Sign In / Signup) page.
 * 3. If the user is signed in, displays the main `Dashboard` page.
 */

function App() {
  const { user, initializing } = useAuth()
  const { t } = useLanguage()

  // 1. Render premium loading splash screen
  if (initializing) {
    return (
      <div className="min-h-dvh bg-app flex flex-col items-center justify-center p-4 select-none relative overflow-hidden">
        <div className="blob-bg bg-purple-500/20 top-1/4 left-1/4"></div>
        <div className="blob-bg bg-cyan-500/20 bottom-1/4 right-1/4"></div>
        
        <div className="flex flex-col items-center animate-pulse relative z-10">
          <div className="p-3 bg-purple-600/15 text-purple-500 rounded-xl mb-3 border border-purple-500/20">
            <Wallet size={36} />
          </div>
          <h2 className="text-xl font-extrabold text-app-text-primary tracking-wider mb-2">
            Kos Wallet
          </h2>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-app-text-secondary">
            <Loader2 size={14} className="animate-spin text-purple-500" />
            <span>{t('establishing_handshake')}</span>
          </div>
        </div>
      </div>
    )
  }

  // 2. State-Based Page Render Router
  return user ? <Dashboard /> : <Auth />
}

export default App
