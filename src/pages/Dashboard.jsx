import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useTransactions } from '../hooks/useTransactions'
import { calculateTotalIncome, calculateTotalExpenses, calculateRemainingBalance, getKosWalletStatus } from '../utils/calculations'
import { formatRupiah } from '../utils/formatters'
import TransactionForm from '../components/TransactionForm'
import TransactionList from '../components/TransactionList'
import WalletStats from '../components/WalletStats'
import { LogOut, Sun, Moon, Plus, Wallet, ArrowUpCircle, ArrowDownCircle, Heart, User } from 'lucide-react'

/**
 * DASHBOARD PAGE COMPONENT
 * 
 * Why this component exists:
 * The heart of Kos Wallet. Coordinates the financial aggregates, sets up the theme manager,
 * and positions the subcomponents (WalletStats, TransactionList, TransactionForm) in a clean,
 * modern grid structure.
 * 
 * Rationale:
 * - Employs a state-based layout for Light / Dark theme syncing with index.css.
 * - Utilizes our separate calculation engine to fetch aggregates dynamically, keeping this component
 *   presentation-focused and clean.
 * 
 * Beginner Concept - DOM Manipulation in React:
 * We use `document.documentElement.classList.toggle('dark')` to add/remove the class `dark`
 * on the highest-level HTML node, instantly switching CSS variables throughout the application.
 */

export default function Dashboard() {
  const { profile, signOut } = useAuth()
  const { transactions } = useTransactions()

  const [isFormOpen, setIsFormOpen] = useState(false)
  
  // Clean Theme Syncing - Retrieve theme preference synchronously on initial setup
  // This completely eliminates any layout shifts or Flash of Incorrect Theme (FOIT) on mount!
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      return savedTheme === 'dark'
    }
    // Fallback to system hardware preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // 1. Calculate Aggregates
  const totalIncome = calculateTotalIncome(transactions)
  const totalExpenses = calculateTotalExpenses(transactions)
  const remainingBalance = calculateRemainingBalance(transactions)

  // 2. Fetch Humorous Boarder Status
  const walletStatus = getKosWalletStatus(totalIncome, totalExpenses)

  // 3. Calculate budget consumption percentage for the progress indicator
  const expensePercentage = totalIncome > 0 ? Math.min((totalExpenses / totalIncome) * 100, 100) : 0

  // Synchronize the isDarkMode state with DOM class lists and Local Storage persistence
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

  return (
    <div className="min-h-dvh py-4 px-3 sm:px-6 md:px-8 md:py-6 max-w-7xl mx-auto flex flex-col gap-4 sm:gap-6 text-left transition-colors duration-300">
      
      {/* BACKGROUND DECORATIVE BLOBS */}
      <div className="blob-bg bg-purple-600/30 top-10 left-10"></div>
      <div className="blob-bg bg-cyan-600/30 bottom-10 right-10"></div>

      {/* TOP HEADER NAVIGATION BAR */}
      <header className="glass-panel rounded-2xl p-3 sm:p-5 flex items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="p-2 sm:p-2.5 bg-purple-600/20 text-purple-400 rounded-xl border border-purple-500/20 shrink-0">
            <Wallet size={20} className="sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold text-app-text-primary tracking-tight leading-none mb-1">
              Kos Wallet
            </h1>
            <p className="text-[10px] md:text-xs text-app-text-secondary font-semibold flex items-center gap-1 leading-none">
              <User size={10} className="text-purple-400 shrink-0 sm:w-3 sm:h-3" />
              <span className="truncate max-w-[100px] xs:max-w-[200px] sm:max-w-none">
                Anak Kos: {profile?.full_name || 'Student'}
              </span>
            </p>
          </div>
        </div>

        {/* Action Button Toggles */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Light/Dark Toggle */}
          <button
            onClick={handleToggleTheme}
            className="p-2.5 bg-app-bg-input text-app-text-primary border border-app-border hover:bg-app-bg-input-hover rounded-xl transition-colors hover:cursor-pointer"
            title="Toggle theme mode"
          >
            {isDarkMode ? <Sun size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Moon size={16} className="sm:w-[18px] sm:h-[18px]" />}
          </button>
          
          {/* Logout button */}
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 py-2.5 px-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs tracking-wider rounded-xl transition-all shadow-md active:translate-y-0.5 hover:cursor-pointer"
          >
            <LogOut size={14} />
            <span className="hidden xs:inline">SIGN OUT</span>
          </button>
        </div>
      </header>

      {/* OVERVIEW STATS GRID PANELS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        
        {/* A. Monthly Allowance Card */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4 relative overflow-hidden">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/25 shrink-0">
            <ArrowUpCircle size={20} className="sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-bold text-app-text-secondary uppercase tracking-wider">Allowance (In)</h3>
            <p className="text-xl sm:text-2xl font-extrabold text-emerald-400 tracking-tight mt-1 truncate">
              {formatRupiah(totalIncome)}
            </p>
            <p className="text-[10px] text-app-text-secondary/80 font-semibold mt-0.5">Total funds collected</p>
          </div>
        </div>

        {/* B. Total Expenses Card */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4 relative overflow-hidden">
          <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/25 shrink-0">
            <ArrowDownCircle size={20} className="sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-bold text-app-text-secondary uppercase tracking-wider">Expenses (Out)</h3>
            <p className="text-xl sm:text-2xl font-extrabold text-rose-400 tracking-tight mt-1 truncate">
              {formatRupiah(totalExpenses)}
            </p>
            <p className="text-[10px] text-app-text-secondary/80 font-semibold mt-0.5">Total money spent</p>
          </div>
        </div>

        {/* C. Remaining Cash Balance Card */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4 relative overflow-hidden col-span-1 sm:col-span-2 md:col-span-1">
          <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/25 shrink-0">
            <Wallet size={20} className="sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-bold text-app-text-secondary uppercase tracking-wider">Remaining Balance</h3>
            <p className="text-xl sm:text-2xl font-extrabold text-purple-400 tracking-tight mt-1 truncate">
              {formatRupiah(remainingBalance)}
            </p>
            <p className="text-[10px] text-app-text-secondary/80 font-semibold mt-0.5">Available money on hand</p>
          </div>
        </div>

      </section>

      {/* STUDENT WALLET HEALTH ALERT BAR */}
      <section className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-5">
        <div className="flex items-start xs:items-center gap-3 xs:gap-4 text-left">
          <span className="text-2xl sm:text-3xl shrink-0" role="img" aria-label="emoji status">
            {walletStatus.emoji}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-1.5 xs:gap-2">
              <h3 className="text-sm font-bold text-app-text-primary leading-none">Wallet Condition</h3>
              <span className={`py-1 px-2 rounded-full text-[9px] sm:text-[10px] font-extrabold border uppercase tracking-wider leading-none ${walletStatus.themeColor}`}>
                {walletStatus.statusName}
              </span>
            </div>
            <p className="text-[11px] text-app-text-secondary mt-1.5 font-semibold">
              {walletStatus.description}
            </p>
          </div>
        </div>

        {/* Budget Progress bar indicator */}
        <div className="flex-1 lg:max-w-md w-full flex flex-col gap-1.5 shrink-0">
          <div className="flex justify-between text-[10px] font-bold text-app-text-secondary uppercase tracking-wider">
            <span>Expenses Consumption</span>
            <span>{expensePercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full h-3 bg-app-bg-input rounded-full overflow-hidden border border-app-border p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                expensePercentage >= 85
                  ? 'bg-rose-500'
                  : expensePercentage >= 50
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${expensePercentage}%` }}
            ></div>
          </div>
        </div>
      </section>

      {/* CHARTS / ANALYTICS SECTION */}
      {/* We mount the chart using key syncing. When isDarkMode toggles, Recharts instantly unmounts */}
      {/* and redraws all SVG elements with correct dynamic color properties, preventing color flashes. */}
      <section className="w-full overflow-hidden">
        <WalletStats key={isDarkMode ? 'dark' : 'light'} />
      </section>

      {/* MAIN LOG HISTORY & ACTION BUTTON HEADER */}
      <section className="grid grid-cols-1 gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-app-text-primary flex items-center gap-2">
              <span>Financial Ledger Log</span>
            </h2>

            {/* Action CTA Button */}
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center justify-center gap-1.5 py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs tracking-wider rounded-xl transition-all shadow-lg shadow-purple-600/10 active:translate-y-0.5 hover:cursor-pointer w-full xs:w-auto"
            >
              <Plus size={16} />
              <span>ADD TRANSACTION</span>
            </button>
          </div>

          {/* Table List render */}
          <TransactionList />
        </div>
      </section>

      {/* ADD TRANSACTION MODAL FORM */}
      <TransactionForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />

      {/* FOOTER ACCENT BRAND */}
      <footer className="mt-8 text-center text-[10px] text-app-text-secondary font-semibold tracking-wider flex items-center justify-center gap-1">
        <span>KOS WALLET © 2026. CREATED WITH</span>
        <Heart size={10} className="text-rose-500" />
        <span>FOR CAMPUS STUDENTS LIVING IN BOARDING HOUSES.</span>
      </footer>

    </div>
  )
}
