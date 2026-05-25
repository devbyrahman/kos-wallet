import React, { useState, useEffect } from 'react'
import { useTransactions } from '../hooks/useTransactions'
import { useCategories } from '../hooks/useCategories'
import { useLanguage } from '../hooks/useLanguage'
import { formatRupiah, getMonthKey } from '../utils/formatters'
import CategoryManagementModal from '../components/CategoryManagementModal'
import { 
  Target, 
  Sparkles, 
  HelpCircle, 
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
  Edit3, 
  Check, 
  X,
  AlertTriangle
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
  Sparkles
}

export default function Budget() {
  const { transactions } = useTransactions()
  const { categories, saveBudgetLimit } = useCategories()
  const { t } = useLanguage()
  const [isManageOpen, setIsManageOpen] = useState(false)

  // State to manage inline editing card per category
  const [editingCatId, setEditingCatId] = useState(null)
  const [editLimitValue, setEditLimitValue] = useState('')

  const handleSaveBudget = (categoryName, limitAmount) => {
    saveBudgetLimit(categoryName, limitAmount)
    setEditingCatId(null)
  }

  // 2. Fetch current month expenses aggregated by category
  const currentMonthKey = getMonthKey()
  const categoryExpenses = {}
  
  transactions
    .filter(tx => tx.type === 'expense' && tx.month_key === currentMonthKey)
    .forEach(tx => {
      const catName = tx.categories?.name || tx.category_name || 'Others'
      const amount = Number(tx.amount || 0)
      categoryExpenses[catName] = (categoryExpenses[catName] || 0) + amount
    })

  // Filter only standard expense categories to show budgeting limits
  const expenseCategories = categories.filter(cat => cat.type === 'expense')

  return (
    <div className="flex flex-col gap-4 sm:gap-6 text-left">
      
      {/* HEADER BAR */}
      <div className="bg-app-card-bg/40 backdrop-blur-xl border border-app-border p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-app-text-primary flex items-center gap-2">
            <Target className="text-purple-400 shrink-0" size={20} />
            <span>{t('consumption') || 'Category Budget Limits'}</span>
          </h2>
          <p className="text-xs text-app-text-secondary mt-0.5">
            Set spending thresholds for each expense category to stay within your monthly allowance.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
          <button
            onClick={() => setIsManageOpen(true)}
            className="text-[10px] sm:text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 py-2 px-3.5 rounded-xl transition-all shadow-md active:translate-y-0.5 cursor-pointer shrink-0"
          >
            {t('manage_categories') || 'Manage Categories'}
          </button>
          <div className="text-[10px] sm:text-xs font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 py-2 px-3.5 rounded-xl shrink-0">
            Month: {new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
        
        {/* A. CATEGORY BUDGET LIST (2-columns) */}
        <div className="lg:col-span-2 space-y-4">
          {expenseCategories.length === 0 ? (
            <div className="glass-panel rounded-2xl p-8 text-center text-app-text-secondary text-xs">
              No categories found.
            </div>
          ) : (
            expenseCategories.map(cat => {
              const DynamicIcon = IconMap[cat.icon] || HelpCircle
              const spent = categoryExpenses[cat.name] || 0
              const limit = cat.budget || 0
              
              const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0
              const isOver = spent > limit && limit > 0

              // Determine health color badge
              let badgeStyle = "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
              let badgeLabel = "Safe"
              let progressColor = "bg-emerald-500"

              if (limit === 0) {
                badgeStyle = "bg-slate-500/10 text-app-text-secondary border border-app-border"
                badgeLabel = "No Limit Set"
                progressColor = "bg-slate-400"
              } else if (spent > limit) {
                badgeStyle = "bg-rose-500/15 text-rose-400 border border-rose-500/25 animate-pulse font-extrabold"
                badgeLabel = "Over Limit"
                progressColor = "bg-rose-500"
              } else if (percentage >= 75) {
                badgeStyle = "bg-amber-500/15 text-amber-400 border border-amber-500/25"
                badgeLabel = "Warning"
                progressColor = "bg-amber-500"
              }

              return (
                <div 
                  key={cat.id} 
                  className={`glass-panel rounded-2xl p-4 sm:p-5 flex flex-col gap-4 relative overflow-hidden transition-all duration-300 ${
                    isOver ? 'border-rose-500/30' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Icon */}
                      <div 
                        className="p-2.5 rounded-xl shrink-0 flex items-center justify-center"
                        style={{
                          backgroundColor: `${cat.color || '#6B7280'}20`,
                          color: cat.color || '#6B7280',
                        }}
                      >
                        <DynamicIcon size={18} />
                      </div>
                      
                      {/* Title */}
                      <div className="min-w-0 text-left">
                        <h4 className="text-xs sm:text-sm font-bold text-app-text-primary truncate">
                          {t(cat.name)}
                        </h4>
                        <p className="text-[10px] text-app-text-secondary font-semibold mt-0.5">
                          {formatRupiah(spent)} spent of {limit > 0 ? formatRupiah(limit) : 'Rp 0'}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge & Editing Triggers */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`py-1 px-2.5 rounded-full text-[9px] font-extrabold tracking-wider uppercase leading-none ${badgeStyle}`}>
                        {badgeLabel}
                      </span>
                      
                      {editingCatId !== cat.id ? (
                        <button
                          onClick={() => {
                            setEditingCatId(cat.id)
                            setEditLimitValue(String(limit))
                          }}
                          className="p-1.5 text-app-text-secondary hover:text-purple-400 hover:bg-app-bg-input rounded-lg transition-colors cursor-pointer"
                          title="Edit Limit"
                        >
                          <Edit3 size={14} />
                        </button>
                      ) : null}
                    </div>
                  </div>

                  {/* Inline editing mode controls */}
                  {editingCatId === cat.id && (
                    <div className="p-3 bg-app-bg-input border border-app-border rounded-xl flex items-center justify-between gap-3 animate-fade-in text-left">
                      <div className="min-w-0 flex-1">
                        <label className="text-[9px] font-bold text-app-text-secondary uppercase tracking-wider">Set Limit Amount (Rp)</label>
                        <input
                          type="number"
                          value={editLimitValue}
                          onChange={(e) => setEditLimitValue(e.target.value)}
                          placeholder="e.g. 500000"
                          className="w-full mt-1 bg-app-card-bg text-app-text-primary border border-app-border focus:border-purple-500 rounded-lg py-1 px-2 text-xs font-semibold outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 self-end">
                        <button
                          onClick={() => handleSaveBudget(cat.name, editLimitValue)}
                          className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors cursor-pointer"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => setEditingCatId(null)}
                          className="p-2 bg-app-card-bg hover:bg-app-bg-input border border-app-border text-app-text-secondary rounded-lg transition-colors cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Progress Meter Bar */}
                  <div className="space-y-1.5">
                    <div className="w-full h-2 bg-app-bg-input rounded-full overflow-hidden border border-app-border/40 p-0.5">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    {limit > 0 && (
                      <div className="flex justify-between text-[9px] font-bold text-app-text-secondary uppercase">
                        <span>Usage</span>
                        <span>{percentage.toFixed(0)}%</span>
                      </div>
                    )}
                  </div>

                  {/* Over limit hazard alert */}
                  {isOver && (
                    <div className="mt-1 p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-rose-400 text-[10px] font-semibold text-left">
                      <AlertTriangle size={12} className="shrink-0 text-rose-400" />
                      <span>Warning: You have exceeded your budget by {formatRupiah(spent - limit)}!</span>
                    </div>
                  )}

                </div>
              )
            })
          )}
        </div>

        {/* B. DYNAMIC AI RECOMENDATION CARD */}
        <div className="space-y-4">
          <div className="glass-panel rounded-2xl p-5 border border-purple-500/20 relative overflow-hidden bg-gradient-to-br from-app-card-bg/80 to-purple-600/5">
            <div className="absolute top-0 right-0 p-6 opacity-10 text-purple-400 pointer-events-none">
              <Sparkles size={100} />
            </div>

            <div className="flex items-center gap-2 text-purple-400">
              <Sparkles size={18} />
              <h3 className="text-sm font-extrabold uppercase tracking-wide">AI Recommendation</h3>
            </div>
            
            <h4 className="text-sm font-bold text-app-text-primary mt-4 text-left">
              💡 Smart Budgeting Insights
            </h4>
            
            <div className="mt-3 space-y-3.5 text-xs text-app-text-secondary font-semibold leading-relaxed text-left">
              <p>
                “Kamu membelanjakan Rp {(categoryExpenses['Food'] || 0).toLocaleString()} untuk <strong className="text-app-text-primary">Makanan</strong> bulan ini. 
                Dengan rata-rata belanja Rp 20.000 sekali makan, cobalah membatasi nongkrong di kafe di akhir pekan untuk menyisihkan Rp 100.000 lebih banyak!”
              </p>
              <div className="p-3 bg-purple-600/10 border border-purple-500/20 rounded-xl">
                <span className="text-[10px] font-bold text-purple-400 uppercase block mb-1">Target Penghematan</span>
                <span className="text-sm font-extrabold text-app-text-primary">Rp 150.000 / Bulan</span>
              </div>
              <p className="text-[10px] text-app-text-secondary/70 italic mt-4">
                Powered by Future Smart AI Finance Advisory Engine module.
              </p>
            </div>
          </div>
        </div>

      </div>

      <CategoryManagementModal isOpen={isManageOpen} onClose={() => setIsManageOpen(false)} />

    </div>
  )
}
