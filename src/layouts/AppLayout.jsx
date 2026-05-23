import React, { useState, useEffect } from 'react'
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useLanguage } from '../hooks/useLanguage'
import { 
  LayoutDashboard, 
  Receipt, 
  TrendingUp, 
  Target, 
  Settings as SettingsIcon, 
  LogOut, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Wallet, 
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

export default function AppLayout() {
  const { profile, signOut, user } = useAuth()
  const { t, language } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('kos_sidebar_collapsed') === 'true'
  })
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Local theme state mirroring Dashboard's setup
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      return savedTheme === 'dark'
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // Synchronize Dark / Light class toggles
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDarkMode])

  const handleToggleTheme = () => {
    setIsDarkMode(prev => !prev)
  }

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev
      localStorage.setItem('kos_sidebar_collapsed', String(next))
      return next
    })
  }

  // Active path checking
  const isActive = (path) => location.pathname === path

  const menuItems = [
    { path: '/dashboard', label: t('dashboard') || 'Dashboard', icon: LayoutDashboard },
    { path: '/transactions', label: t('transactions') || 'Transactions', icon: Receipt },
    { path: '/analytics', label: t('analytics') || 'Analytics', icon: TrendingUp },
    { path: '/budget', label: t('budget') || 'Budget', icon: Target },
    { path: '/settings', label: t('settings') || 'Settings', icon: SettingsIcon },
  ]

  // Translate page headers dynamically
  const getPageTitle = () => {
    const activeItem = menuItems.find(item => item.path === location.pathname)
    return activeItem ? activeItem.label : 'Kos Wallet'
  }

  return (
    <div className="min-h-dvh flex bg-app text-app-text-primary transition-colors duration-300 relative overflow-hidden select-none">
      
      {/* BACKGROUND DECORATIVE BLOBS */}
      <div className="blob-bg bg-purple-600/25 top-10 left-10"></div>
      <div className="blob-bg bg-cyan-600/25 bottom-10 right-10"></div>

      {/* 1. DESKTOP SIDEBAR */}
      <aside 
        className={`hidden md:flex flex-col bg-app-card-bg/60 backdrop-blur-xl border-r border-app-border h-screen sticky top-0 transition-all duration-300 z-30 shrink-0 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand/Logo Header */}
        <div className="p-5 flex items-center justify-between border-b border-app-border/40 min-h-[72px]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-purple-600/20 text-purple-400 rounded-xl border border-purple-500/20 shrink-0">
              <Wallet size={20} />
            </div>
            {!isSidebarCollapsed && (
              <span className="font-extrabold text-base tracking-tight truncate bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Kos Wallet
              </span>
            )}
          </div>
          
          {/* Sidebar Collapse Toggle */}
          {!isSidebarCollapsed && (
            <button 
              onClick={handleToggleSidebar}
              className="text-app-text-secondary hover:text-purple-400 p-1 rounded-lg hover:bg-app-bg-input cursor-pointer transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3.5 px-3 py-3 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all relative group cursor-pointer ${
                  active 
                    ? 'bg-purple-600/15 text-purple-400 border-l-2 border-purple-500 pl-2.5' 
                    : 'text-app-text-secondary hover:text-app-text-primary hover:bg-app-bg-input'
                }`}
              >
                <Icon size={18} className="shrink-0" />
                {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                
                {/* Collapsed Tooltip fallback */}
                {isSidebarCollapsed && (
                  <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-md z-50 pointer-events-none whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Desktop Sidebar Footer */}
        <div className="p-4 border-t border-app-border/40 space-y-3 bg-app-card-bg/25">
          {/* User profile preview */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0">
              <User size={16} />
            </div>
            {!isSidebarCollapsed && (
              <div className="min-w-0 flex-1 text-left">
                <p className="text-xs font-bold text-app-text-primary truncate">
                  {profile?.full_name || 'Student'}
                </p>
                <p className="text-[10px] font-semibold text-app-text-secondary truncate">
                  {t('student') || 'Anak Kos'}
                </p>
              </div>
            )}
          </div>

          {/* Expand sidebar trigger */}
          {isSidebarCollapsed && (
            <button 
              onClick={handleToggleSidebar}
              className="w-full flex items-center justify-center py-2 text-app-text-secondary hover:text-purple-400 hover:bg-app-bg-input rounded-xl border border-app-border cursor-pointer transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          )}

          {/* Collapsible Action Buttons */}
          {!isSidebarCollapsed && (
            <button
              onClick={signOut}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs tracking-wider rounded-xl transition-all shadow-md active:translate-y-0.5 hover:cursor-pointer"
            >
              <LogOut size={14} />
              <span>{t('sign_out') || 'SIGN OUT'}</span>
            </button>
          )}
        </div>
      </aside>

      {/* 2. MAIN APP CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* TOP PERSISTENT NAVBAR CONTAINER */}
        <header className="glass-panel border-t-0 border-x-0 rounded-none px-4 py-3 sm:px-6 md:px-8 flex items-center justify-between gap-4 z-20 shrink-0 min-h-[64px] sm:min-h-[72px]">
          {/* Active Route Title */}
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Hamburger drawer trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-app-text-secondary hover:text-app-text-primary hover:bg-app-bg-input rounded-xl border border-app-border transition-colors cursor-pointer"
            >
              <Menu size={16} />
            </button>
            <h2 className="text-base sm:text-lg md:text-xl font-extrabold text-app-text-primary tracking-tight">
              {getPageTitle()}
            </h2>
          </div>

          {/* Top Navbar Actions */}
          <div className="flex items-center gap-2">
            {/* Theme switcher */}
            <button
              onClick={handleToggleTheme}
              className="p-2 sm:p-2.5 bg-app-bg-input text-app-text-primary border border-app-border hover:bg-app-bg-input-hover rounded-xl transition-colors hover:cursor-pointer shadow-sm"
              title="Toggle theme"
            >
              {isDarkMode ? <Sun size={14} className="sm:w-4 sm:h-4" /> : <Moon size={14} className="sm:w-4 sm:h-4" />}
            </button>

            {/* User Profile display (Mobile-only icon) */}
            <div className="md:hidden w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0 shadow-sm" title={profile?.full_name}>
              <User size={14} />
            </div>
          </div>
        </header>

        {/* 3. DYNAMIC CONTENT OUTLET (Scrollable Viewport) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 pb-24 md:pb-8 relative">
          <Outlet />
        </main>
      </div>

      {/* 4. ERGONOMIC BOTTOM NAVIGATION BAR (Mobile-only) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 glass-panel border-x-0 border-b-0 rounded-none py-2 px-3 flex items-center justify-around z-30 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-lg">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all cursor-pointer ${
                active 
                  ? 'text-purple-400 scale-105 font-bold' 
                  : 'text-app-text-secondary hover:text-app-text-primary'
              }`}
            >
              <Icon size={18} />
              <span className="text-[9px] font-bold tracking-tight">{item.label}</span>
            </Link>
          )}
        )}
      </div>

      {/* 5. MOBILE DRAWER OVERLAY (Hambuger menu secondary actions) */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop lock */}
          <div 
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
          ></div>

          {/* Drawer drawer content */}
          <div className="relative flex flex-col w-64 max-w-xs bg-app-card-bg/95 backdrop-blur-2xl h-full p-5 border-r border-app-border shadow-2xl animate-slide-in text-left">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-app-border/40">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-600/20 text-purple-400 rounded-xl border border-purple-500/20">
                  <Wallet size={16} />
                </div>
                <span className="font-extrabold text-sm tracking-tight bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Kos Wallet
                </span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-app-text-secondary hover:text-app-text-primary cursor-pointer p-1"
              >
                <X size={16} />
              </button>
            </div>

            {/* User Profile */}
            <div className="mb-6 p-3 bg-app-bg-input rounded-xl border border-app-border flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0">
                <User size={16} />
              </div>
              <div className="min-w-0 text-left">
                <p className="text-xs font-bold text-app-text-primary truncate">
                  {profile?.full_name || 'Student'}
                </p>
                <p className="text-[10px] font-semibold text-app-text-secondary truncate">
                  {t('student') || 'Anak Kos'}
                </p>
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <nav className="flex-1 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.path)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3.5 px-3 py-3 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all cursor-pointer ${
                      active 
                        ? 'bg-purple-600/15 text-purple-400 border-l-2 border-purple-500 pl-2.5' 
                        : 'text-app-text-secondary hover:text-app-text-primary hover:bg-app-bg-input'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Drawer Logout Action */}
            <div className="pt-4 border-t border-app-border/40 mt-auto">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  signOut()
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
              >
                <LogOut size={14} />
                <span>{t('sign_out') || 'SIGN OUT'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
