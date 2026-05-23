import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useLanguage } from '../hooks/useLanguage'
import { supabase } from '../services/supabase'
import { 
  Settings as SettingsIcon, 
  User, 
  Globe, 
  Sun, 
  Moon, 
  LogOut, 
  Check, 
  AlertCircle 
} from 'lucide-react'

export default function Settings() {
  const { user, profile, refreshProfile, signOut, authLoading } = useAuth()
  const { t, language, setLanguage } = useLanguage()

  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [updating, setUpdating] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Sync state if profile loads asynchronously
  useEffect(() => {
    if (profile?.full_name) {
      setFullName(profile.full_name)
    }
  }, [profile])

  // Local theme state syncing
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      return savedTheme === 'dark'
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // Synchronise dark/light theme classes
  const handleToggleTheme = () => {
    const nextTheme = !isDarkMode
    setIsDarkMode(nextTheme)
    if (nextTheme) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  // Update profile name directly to Supabase profiles table
  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    if (!fullName.trim()) {
      setErrorMsg(t('err_full_name') || 'Please enter a valid name!')
      return
    }

    setUpdating(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName.trim() })
        .eq('id', user.id)

      if (error) throw error

      // Refresh global context profile instantly!
      await refreshProfile()
      setSuccessMsg(language === 'id' ? 'Profil berhasil diperbarui!' : 'Profile updated successfully!')
      
      // Auto clear success message after 3 seconds
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      setErrorMsg(err.message)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6 text-left max-w-2xl mx-auto">
      
      {/* HEADER SECTION */}
      <div className="bg-app-card-bg/40 backdrop-blur-xl border border-app-border p-4 sm:p-5 rounded-2xl flex items-center gap-3">
        <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20 w-fit shrink-0">
          <SettingsIcon size={20} />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-app-text-primary">
            {t('settings') || 'Application Settings'}
          </h2>
          <p className="text-xs text-app-text-secondary mt-0.5">
            Customize your boarder profile details and application preferences.
          </p>
        </div>
      </div>

      {/* 1. STUDENT PROFILE CUSTOMISATION CARD */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-app-border/40">
          <User className="text-purple-400" size={16} />
          <h3 className="text-sm font-bold text-app-text-primary uppercase tracking-wider">
            {language === 'id' ? 'Profil Mahasiswa' : 'Student Profile'}
          </h3>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          
          {/* Status Alerts */}
          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center gap-2 text-xs font-semibold">
              <Check size={14} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-center gap-2 text-xs font-semibold">
              <AlertCircle size={14} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Full Name Input Field */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-app-text-secondary uppercase tracking-wider block">
              {t('full_name') || 'Full Name'}
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Abdul Rahman"
              disabled={updating}
              className="w-full bg-app-bg-input text-app-text-primary border border-app-border focus:border-purple-500 outline-none rounded-xl py-2.5 px-4 text-xs font-semibold transition-all disabled:opacity-60"
            />
          </div>

          {/* Email Address (Read-only for security) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-app-text-secondary/50 uppercase tracking-wider block">
              {t('email_address') || 'Email Address'} ({language === 'id' ? 'Hanya Baca' : 'Read-only'})
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full bg-app-bg-input/40 text-app-text-secondary/60 border border-app-border/40 rounded-xl py-2.5 px-4 text-xs font-semibold cursor-not-allowed"
            />
          </div>

          {/* Submit Save Button */}
          <button
            type="submit"
            disabled={updating}
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs tracking-wider rounded-xl transition-all shadow-md active:translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5"
          >
            {updating ? (
              <span>{t('processing') || 'Processing...'}</span>
            ) : (
              <>
                <Check size={14} />
                <span>{language === 'id' ? 'SIMPAN PERUBAHAN' : 'SAVE CHANGES'}</span>
              </>
            )}
          </button>

        </form>
      </div>

      {/* 2. GENERAL PREFERENCES CARD */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-app-border/40">
          <Globe className="text-purple-400" size={16} />
          <h3 className="text-sm font-bold text-app-text-primary uppercase tracking-wider">
            {language === 'id' ? 'Pengaturan Aplikasi' : 'Preferences'}
          </h3>
        </div>

        <div className="space-y-4">
          
          {/* Language Switcher row */}
          <div className="flex items-center justify-between gap-4 py-2 border-b border-app-border/20 last:border-b-0">
            <div className="text-left">
              <h4 className="text-xs font-bold text-app-text-primary">
                {language === 'id' ? 'Bahasa Aplikasi' : 'Application Language'}
              </h4>
              <p className="text-[10px] text-app-text-secondary font-semibold mt-0.5">
                Toggle active dictionary translations.
              </p>
            </div>
            
            <button
              onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
              className="px-3 py-2 bg-app-bg-input text-app-text-primary border border-app-border hover:bg-app-bg-input-hover rounded-xl transition-colors font-bold text-xs hover:cursor-pointer flex items-center gap-1 shadow-sm shrink-0"
              title="Switch Language / Ganti Bahasa"
            >
              <span className={language === 'id' ? 'text-purple-400 font-extrabold' : 'opacity-60'}>ID</span>
              <span className="opacity-40 font-normal">|</span>
              <span className={language === 'en' ? 'text-purple-400 font-extrabold' : 'opacity-60'}>EN</span>
            </button>
          </div>

          {/* Theme Toggler row */}
          <div className="flex items-center justify-between gap-4 py-2 border-b border-app-border/20 last:border-b-0">
            <div className="text-left">
              <h4 className="text-xs font-bold text-app-text-primary">
                {language === 'id' ? 'Tema Tampilan' : 'Interface Theme'}
              </h4>
              <p className="text-[10px] text-app-text-secondary font-semibold mt-0.5">
                Toggle dark glassmorphism mode or light contrast mode.
              </p>
            </div>

            <button
              onClick={handleToggleTheme}
              className="p-2 bg-app-bg-input text-app-text-primary border border-app-border hover:bg-app-bg-input-hover rounded-xl transition-colors hover:cursor-pointer flex items-center gap-2 shadow-sm text-xs font-bold shrink-0"
              title="Toggle theme mode"
            >
              {isDarkMode ? (
                <>
                  <Sun size={14} className="text-purple-400" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon size={14} className="text-purple-400" />
                  <span>Dark</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* 3. SIGN OUT TRIGGER ZONE */}
      <div className="glass-panel border-rose-500/20 bg-rose-500/5 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div className="text-left">
          <h4 className="text-xs font-extrabold text-rose-500 dark:text-rose-400">
            {language === 'id' ? 'Keluar Akun' : 'Sign Out Session'}
          </h4>
          <p className="text-[10px] text-app-text-secondary font-semibold mt-0.5">
            Log out from your student account. All local transaction caches will be cleared safely.
          </p>
        </div>

        <button
          onClick={signOut}
          disabled={authLoading}
          className="flex items-center justify-center gap-1.5 py-2.5 px-5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs tracking-wider rounded-xl transition-all shadow-md active:translate-y-0.5 hover:cursor-pointer shrink-0 disabled:opacity-60"
        >
          <LogOut size={14} />
          <span>{t('sign_out') || 'SIGN OUT'}</span>
        </button>
      </div>

    </div>
  )
}
