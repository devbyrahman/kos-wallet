import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Mail, Lock, User, Wallet, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react'

/**
 * AUTH PAGE COMPONENT
 * 
 * Why this page exists:
 * The gateway of the application. It handles user registration (Sign Up) and login (Sign In)
 * in a single, highly aesthetic, dual-mode layout card.
 * 
 * Design Details:
 * - Uses responsive mobile-first grids.
 * - Styled with a modern dark-mode glassmorphism backdrop (`glass-panel` custom CSS).
 * - Animated accent blobs on the background (`blob-bg`).
 * 
 * Beginner Concept - Form Control in React:
 * We use "Controlled Components", where each input's `value` is tied to a React `useState` variable,
 * and updated via `onChange` events. This ensures that the input's state is always synchronized
 * with the React component's memory state!
 */

export default function Auth() {
  const { signIn, signUp, authLoading, error: authError } = useAuth()
  
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  
  const [localError, setLocalError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError(null)

    // Basic Input Validations
    if (!email || !password) {
      setLocalError('Please fill in all fields!')
      return
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long!')
      return
    }
    if (!isLogin && !fullName) {
      setLocalError('Please tell us your full name!')
      return
    }

    if (isLogin) {
      const { error } = await signIn(email, password)
      if (error) {
        setLocalError(error)
      }
    } else {
      const { error } = await signUp(email, password, fullName)
      if (error) {
        setLocalError(error)
      } else {
        // Success alert for signup
        alert('Account created! Please log in.')
        setIsLogin(true)
        setPassword('')
      }
    }
  }

  return (
    <div className="relative min-h-dvh flex items-center justify-center p-4 overflow-hidden select-none bg-app">
      {/* Visual background blobs for premium aesthetic */}
      <div className="blob-bg bg-purple-500/15 top-1/4 left-1/4"></div>
      <div className="blob-bg bg-cyan-500/15 bottom-1/4 right-1/4"></div>

      {/* Main glass card */}
      <div className="w-full max-w-md glass-panel rounded-2xl p-6 sm:p-8 text-left shadow-2xl relative z-10">
        
        {/* App Logo & Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="p-3 bg-purple-600/15 text-purple-500 rounded-xl mb-3 border border-purple-500/20">
            <Wallet size={36} className="animate-bounce" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-app-text-primary mb-1">
            Kos Wallet
          </h1>
          <p className="text-sm text-app-text-secondary font-semibold">
            {isLogin ? 'Welcome back! Manage your allowance efficiently.' : 'Join your fellow boarders and save money!'}
          </p>
        </div>

        {/* Global Error Message Banner */}
        {(localError || authError) && (
          <div className="flex items-center gap-2 mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 text-xs font-semibold">
            <AlertCircle size={20} className="shrink-0" />
            <span>{localError || authError}</span>
          </div>
        )}

        {/* Auth Input Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name field (Visible only during registration) */}
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-app-text-secondary uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-app-text-secondary/60" />
                <input
                  type="text"
                  placeholder="e.g. Budi Santoso"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={authLoading}
                  className="w-full py-3 pl-11 pr-4 bg-app-bg-input text-app-text-primary placeholder-slate-400 dark:placeholder-slate-500 border border-app-border outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-semibold text-sm rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          )}

          {/* Email field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-app-text-secondary uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-app-text-secondary/60" />
              <input
                type="email"
                placeholder="budi@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={authLoading}
                className="w-full py-3 pl-11 pr-4 bg-app-bg-input text-app-text-primary placeholder-slate-400 dark:placeholder-slate-500 border border-app-border outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-semibold text-sm rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-app-text-secondary uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-app-text-secondary/60" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={authLoading}
                className="w-full py-3 pl-11 pr-11 bg-app-bg-input text-app-text-primary placeholder-slate-400 dark:placeholder-slate-500 border border-app-border outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-semibold text-sm rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={authLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-app-text-secondary/60 hover:text-app-text-primary transition-colors disabled:opacity-60"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={authLoading}
            className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed rounded-xl text-white font-bold text-sm tracking-wider shadow-lg shadow-purple-600/20 active:translate-y-0.5 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer mt-6"
          >
            {authLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}</span>
            )}
          </button>
        </form>

        {/* Toggle Mode Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-app-text-secondary font-semibold">
            {isLogin ? "Don't have an account yet?" : 'Already registered?'}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setLocalError(null)
              }}
              disabled={authLoading}
              className="ml-1.5 font-bold text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 outline-none underline decoration-purple-600/30 dark:decoration-purple-400/30 hover:cursor-pointer transition-colors"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

      </div>
    </div>
  )
}
