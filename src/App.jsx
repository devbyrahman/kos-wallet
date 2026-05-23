import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { useLanguage } from './hooks/useLanguage'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Analytics from './pages/Analytics'
import Budget from './pages/Budget'
import Settings from './pages/Settings'
import AppLayout from './layouts/AppLayout'
import { Loader2, Wallet } from 'lucide-react'

// AuthGuard component to enforce protection
function ProtectedRoute({ children }) {
  const { user, initializing } = useAuth()

  if (initializing) {
    // Let App handle global initialization loading splash
    return null
  }

  return user ? children : <Navigate to="/auth" replace />
}

// PublicRoute to redirect authenticated users away from /auth gateway
function PublicRoute({ children }) {
  const { user, initializing } = useAuth()

  if (initializing) {
    return null
  }

  return user ? <Navigate to="/dashboard" replace /> : children
}

function App() {
  const { initializing } = useAuth()
  const { t } = useLanguage()

  // 1. Render premium loading splash screen during initial handshake
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

  return (
    <BrowserRouter>
      <Routes>
        {/* Unprotected Auth Gateway */}
        <Route 
          path="/auth" 
          element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          } 
        />

        {/* Protected App Layout Structure */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* Default index redirects to /dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="budget" element={<Budget />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch-all fallback redirects to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
