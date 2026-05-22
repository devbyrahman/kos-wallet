import React from 'react'
import { useTransactions } from '../hooks/useTransactions'
import { useLanguage } from '../hooks/useLanguage'
import { calculateExpensesByCategory, calculateDailySpendingTrend } from '../utils/calculations'
import { formatRupiah } from '../utils/formatters'
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { BarChart3, PieChart as PieIcon, TrendingUp } from 'lucide-react'

/**
 * WALLET STATS COMPONENT
 * 
 * Why this component exists:
 * Uses Recharts to visually map out transactions.
 * - Daily Spending Trend (Area Chart): Helps students see which days they overspent.
 * - Category Distribution (Pie Chart): Helps students identify where their largest financial leak is.
 * 
 * Rationale:
 * Data is derived using our pure calculation utility functions, satisfying the requirement to separate
 * business calculations from UI rendering.
 */

export default function WalletStats() {
  const { transactions } = useTransactions()
  const { t } = useLanguage()

  const pieData = calculateExpensesByCategory(transactions)
  const areaData = calculateDailySpendingTrend(transactions)

  const hasExpenses = pieData.length > 0

  // Custom tooltips utilizing semantic color variables and clean glassmorphism styling
  const CustomAreaTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-app-card-bg border border-app-card-border rounded-xl shadow-xl text-left backdrop-blur-md">
          <p className="text-[10px] font-bold text-app-text-secondary uppercase tracking-wider">{t('daily_expense')}</p>
          <p className="text-sm font-extrabold text-purple-500 mt-0.5">
            {formatRupiah(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-app-card-bg border border-app-card-border rounded-xl shadow-xl text-left backdrop-blur-md">
          <p className="text-[10px] font-bold text-app-text-secondary uppercase tracking-wider">{t(payload[0].name)}</p>
          <p className="text-sm font-extrabold mt-0.5" style={{ color: payload[0].payload.color }}>
            {formatRupiah(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left select-none">
      
      {/* 1. Daily Spending Trend Card */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-col min-h-[320px] sm:min-h-[350px]">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/20">
            <TrendingUp size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-app-text-primary">{t('daily_spending')}</h3>
            <p className="text-[10px] text-app-text-secondary font-medium">{t('daily_spending_sub')}</p>
          </div>
        </div>

        <div className="flex-1 w-full min-h-[220px]">
          {!hasExpenses ? (
            <div className="h-full flex items-center justify-center text-app-text-secondary/70 text-xs font-semibold">
              {t('no_expense_chart')}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.4} />
                <XAxis
                  dataKey="date"
                  stroke="var(--text-secondary)"
                  fontSize={10}
                  fontWeight={600}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--text-secondary)"
                  fontSize={10}
                  fontWeight={600}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `Rp ${val / 1000}k`}
                />
                <Tooltip content={<CustomAreaTooltip />} />
                <Area
                  type="monotone"
                  dataKey="Amount"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorAmount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 2. Spending Distribution by Category Card */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-col min-h-[320px] sm:min-h-[350px]">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg border border-cyan-500/20">
            <PieIcon size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-app-text-primary">{t('category_dist')}</h3>
            <p className="text-[10px] text-app-text-secondary font-medium">{t('category_dist_sub')}</p>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {!hasExpenses ? (
            <div className="col-span-12 h-full flex items-center justify-center text-app-text-secondary/70 text-xs font-semibold">
              {t('no_categories_chart')}
            </div>
          ) : (
            <>
              {/* Recharts Pie component */}
              <div className="col-span-12 md:col-span-7 h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Dynamic Categories Legend List */}
              <div className="col-span-12 md:col-span-5 flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
                {pieData.map((entry, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2 text-xs font-semibold">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-2.5 h-2.5 rounded shrink-0" style={{ backgroundColor: entry.color }}></span>
                      <span className="text-app-text-primary truncate">{t(entry.name)}</span>
                    </div>
                    <span className="text-app-text-secondary font-bold shrink-0">{formatRupiah(entry.value)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  )
}
