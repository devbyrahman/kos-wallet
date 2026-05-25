import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTransactions } from '../hooks/useTransactions'
import { useLanguage } from '../hooks/useLanguage'
import { calculateTotalIncome, calculateTotalExpenses, calculateRemainingBalance, getKosWalletStatus, sortTransactionsChronologically } from '../utils/calculations'
import { formatRupiah, formatDate } from '../utils/formatters'
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Wallet, 
  ChevronRight, 
  History,
  TrendingUp,
  HelpCircle, 
  Utensils, 
  Car, 
  BookOpen, 
  Wifi, 
  Gamepad2, 
  Flame, 
  PiggyBank, 
  PlusCircle,
  Heart,
  User,
  Briefcase,
  Sparkles
} from 'lucide-react'

// Simple map to render Lucide Icons dynamically from database strings
const IconMap = {
  Utensils,
  Car,
  BookOpen,
  Wifi,
  Gamepad2,
  Flame,
  PiggyBank,
  Wallet,
  PlusCircle,
  Heart,
  User,
  Briefcase,
  Sparkles,
  HelpCircle
}

export default function Dashboard() {
  const { profile } = useAuth()
  const { transactions, loading } = useTransactions()
  const { t } = useLanguage()

  // 1. Calculate Aggregates
  const totalIncome = calculateTotalIncome(transactions)
  const totalExpenses = calculateTotalExpenses(transactions)
  const remainingBalance = calculateRemainingBalance(transactions)

  // 2. Fetch Humorous Boarder Status
  const walletStatus = getKosWalletStatus(totalIncome, totalExpenses)

  // 3. Calculate budget consumption percentage for the progress indicator
  const expensePercentage = totalIncome > 0 ? Math.min((totalExpenses / totalIncome) * 100, 100) : 0

  // 4. Fetch the 5 most recent transactions for preview sorted deterministically
  const sortedTransactions = sortTransactionsChronologically(transactions)
  const recentTransactions = sortedTransactions.slice(0, 5)

  return (
    <div className="flex flex-col gap-4 sm:gap-6 text-left">
      
      {/* WELCOME BANNER */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-app-text-primary tracking-tight">
            Hi, {profile?.full_name || 'Student'}! 👋
          </h2>
          <p className="text-xs text-app-text-secondary mt-0.5">
            {t('auth_welcome_back_desc') || 'Welcome back! Manage your allowance efficiently.'}
          </p>
        </div>
        <Link
          to="/settings"
          className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-0.5 self-start sm:self-auto hover:cursor-pointer"
        >
          <span>{t('settings') || 'Settings'}</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      {/* OVERVIEW STATS CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Allowance Card */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 relative overflow-hidden">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/25 shrink-0 animate-pulse-slow">
            <ArrowUpCircle size={20} className="sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-bold text-app-text-secondary uppercase tracking-wider">{t('allowance')}</h3>
            <p className="text-xl sm:text-2xl font-extrabold text-emerald-400 tracking-tight mt-1 truncate">
              {formatRupiah(totalIncome)}
            </p>
            <p className="text-[10px] text-app-text-secondary/80 font-semibold mt-0.5">{t('allowance_sub')}</p>
          </div>
        </div>

        {/* Total Expenses Card */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 relative overflow-hidden">
          <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/25 shrink-0">
            <ArrowDownCircle size={20} className="sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-bold text-app-text-secondary uppercase tracking-wider">{t('expenses')}</h3>
            <p className="text-xl sm:text-2xl font-extrabold text-rose-400 tracking-tight mt-1 truncate">
              {formatRupiah(totalExpenses)}
            </p>
            <p className="text-[10px] text-app-text-secondary/80 font-semibold mt-0.5">{t('expenses_sub')}</p>
          </div>
        </div>

        {/* Remaining Cash Balance Card */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 relative overflow-hidden col-span-1 sm:col-span-2 md:col-span-1">
          <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/25 shrink-0">
            <Wallet size={20} className="sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-bold text-app-text-secondary uppercase tracking-wider">{t('balance')}</h3>
            <p className="text-xl sm:text-2xl font-extrabold text-purple-400 tracking-tight mt-1 truncate">
              {formatRupiah(remainingBalance)}
            </p>
            <p className="text-[10px] text-app-text-secondary/80 font-semibold mt-0.5">{t('balance_sub')}</p>
          </div>
        </div>
      </section>

      {/* STUDENT WALLET HEALTH ALERT BAR */}
      <section className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-5">
        <div className="flex items-start xs:items-center gap-3.5 text-left">
          <span className="text-2xl sm:text-3xl shrink-0" role="img" aria-label="emoji status">
            {walletStatus.emoji}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-1.5 xs:gap-2">
              <h3 className="text-sm font-bold text-app-text-primary leading-none">{t('wallet_condition')}</h3>
              <span className={`py-1 px-2 rounded-full text-[9px] sm:text-[10px] font-extrabold border uppercase tracking-wider leading-none ${walletStatus.themeColor}`}>
                {t(`status_${walletStatus.key}_title`) || walletStatus.statusName}
              </span>
            </div>
            <p className="text-[11px] text-app-text-secondary mt-1.5 font-semibold">
              {t(`status_${walletStatus.key}_desc`) || walletStatus.description}
            </p>
          </div>
        </div>

        {/* Budget Progress bar indicator */}
        <div className="flex-1 lg:max-w-md w-full flex flex-col gap-1.5 shrink-0">
          <div className="flex justify-between text-[10px] font-bold text-app-text-secondary uppercase tracking-wider">
            <span>{t('consumption')}</span>
            <span>{expensePercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full h-3 bg-app-bg-input rounded-full overflow-hidden border border-app-border p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                expensePercentage >= 85
                  ? 'bg-rose-500 animate-pulse'
                  : expensePercentage >= 50
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${expensePercentage}%` }}
            ></div>
          </div>
        </div>
      </section>

      {/* RECENT TRANSACTIONS PREVIEW & MINI ANALYTICS PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* A. Recent Transactions Preview Card */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-app-text-primary flex items-center gap-2">
              <History size={16} className="text-purple-400" />
              <span>{t('recent_transactions') || 'Recent Transactions'}</span>
            </h3>
            <Link
              to="/transactions"
              className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-0.5 hover:cursor-pointer"
            >
              <span>{t('view_all') || 'View All'}</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 text-app-text-secondary gap-2">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-app-text-secondary text-xs font-semibold">
              {t('empty_transactions') || 'No transactions recorded yet.'}
            </div>
          ) : (
            <div className="divide-y divide-app-border">
              {recentTransactions.map((tx) => {
                const DynamicIcon = IconMap[tx.categories?.icon] || HelpCircle
                const isExpense = tx.type === 'expense'

                return (
                  <div key={tx.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0 gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className="p-2.5 rounded-xl shrink-0 flex items-center justify-center"
                        style={{
                          backgroundColor: `${tx.categories?.color || '#6B7280'}15`,
                          color: tx.categories?.color || '#6B7280',
                        }}
                      >
                        <DynamicIcon size={16} />
                      </div>
                      <div className="min-w-0 text-left">
                        <p className="text-xs font-bold text-app-text-primary truncate">
                          {tx.description}
                        </p>
                        <p className="text-[10px] text-app-text-secondary font-semibold mt-0.5">
                          {formatDate(tx.date)}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-extrabold ${
                        isExpense ? 'text-rose-500' : 'text-emerald-400'
                      }`}
                    >
                      {isExpense ? '-' : '+'}{formatRupiah(tx.amount)}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* B. Mini Analytics Call-To-Action Card */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4">
          <div>
            <div className="p-3 bg-purple-600/10 text-purple-400 rounded-xl border border-purple-500/20 w-fit">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-sm font-extrabold text-app-text-primary mt-4">
              {t('daily_spending') || 'Analytics Insights'}
            </h3>
            <p className="text-xs text-app-text-secondary mt-1.5 font-semibold">
              View beautiful graphs representing your daily spending trend and category expense ratios this month.
            </p>
          </div>

          <Link
            to="/analytics"
            className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs tracking-wider rounded-xl transition-all shadow-md hover:cursor-pointer"
          >
            <span>{t('view_analytics') || 'VIEW DETAILED CHARTS'}</span>
            <ChevronRight size={14} />
          </Link>
        </div>

      </div>

    </div>
  )
}
