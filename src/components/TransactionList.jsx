import React, { useState } from 'react'
import { useTransactions } from '../hooks/useTransactions'
import { useLanguage } from '../hooks/useLanguage'
import { useAuth } from '../hooks/useAuth'
import { formatRupiah, formatDate, getMonthKey } from '../utils/formatters'
import { sortTransactionsChronologically } from '../utils/calculations'
import { 
  Trash2, 
  Filter, 
  Calendar, 
  X, 
  Landmark, 
  HelpCircle, 
  Search,
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
  FileText
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


export default function TransactionList() {
  const { transactions, categories, deleteTransaction, loading } = useTransactions()
  const { t, language } = useLanguage()
  const { profile } = useAuth()

  const [monthFilter, setMonthFilter] = useState(getMonthKey()) // Default: Current Month
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [exporting, setExporting] = useState(false)

  const handleExportPDF = async () => {
    console.log('PDF EXPORT UI: Export PDF button clicked.');
    setExporting(true)
    try {
      console.log('PDF EXPORT UI: Dynamically importing pdfGenerator.js...');
      const { generateMonthlyPDF } = await import('../utils/pdfGenerator')
      console.log('PDF EXPORT UI: pdfGenerator.js loaded! Executing PDF generator...');
      
      await generateMonthlyPDF({
        profile,
        transactions: filteredTransactions,
        categories,
        monthFilter,
        t,
        allTransactions: transactions,
        language
      })
      console.log('PDF EXPORT UI: PDF generation succeeded and download triggered.');
    } catch (err) {
      console.error('PDF EXPORT UI ERROR: Silent catch bypassed. Failed to export PDF!', err)
      const errorMsg = t('err_pdf_failed', { error: err.message })
      alert(errorMsg)
    } finally {
      console.log('PDF EXPORT UI: Resetting exporting state to false.');
      setExporting(false)
    }
  }

  const handleDelete = async (id) => {
    const { success } = await deleteTransaction(id)
    if (success) {
      setDeleteConfirmId(null)
    }
  }

  // Generate the last 6 months for the filter dropdown
  const getFilterMonths = () => {
    const months = []
    const date = new Date()
    for (let i = 0; i < 6; i++) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const label = date.toLocaleString(language === 'id' ? 'id-ID' : 'en-US', { month: 'long', year: 'numeric' })
      months.push({ value: `${year}-${month}`, label })
      date.setMonth(date.getMonth() - 1)
    }
    return months
  }

  const filterMonths = getFilterMonths()

  // Perform highly robust in-memory client-side filtering!
  // This is ultra-fast, allows real-time text searching, and completely avoids disrupting total balance metrics!
  const filteredTransactions = sortTransactionsChronologically(
    transactions.filter((tx) => {
      const matchMonth = !monthFilter || tx.month_key === monthFilter
      const matchCategory = categoryFilter === 'ALL' || tx.category_id === categoryFilter
      
      const matchSearch = !searchQuery || 
        tx.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tx.notes && tx.notes.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchMonth && matchCategory && matchSearch
    })
  )

  return (
    <div className="flex flex-col gap-4 text-left select-none">
      
      {/* Dynamic Filter & Search Controls Card */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 space-y-4">
        
        {/* Header and Reset Button */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-base font-display font-bold text-app-text-primary flex items-center gap-2">
            <Filter size={18} className="text-purple-400" />
            <span>{t('filter_transactions') || 'Filter Transactions'}</span>
          </h3>
          <div className="flex items-center gap-4 shrink-0">
            {/* Export Report PDF Button */}
            <button
              onClick={handleExportPDF}
              disabled={exporting || filteredTransactions.length === 0}
              className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1.5 hover:cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              title="Export Report PDF / Ekspor Laporan PDF"
            >
              {exporting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>{t('processing') || 'Processing...'}</span>
                </>
              ) : (
                <>
                  <FileText size={14} />
                  <span>{t('export_pdf') || 'Export PDF'}</span>
                </>
              )}
            </button>

            {(monthFilter !== getMonthKey() || categoryFilter !== 'ALL' || searchQuery !== '') && (
              <button
                onClick={() => {
                  setMonthFilter(getMonthKey())
                  setCategoryFilter('ALL')
                  setSearchQuery('')
                }}
                className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 hover:cursor-pointer transition-colors shrink-0"
              >
                <X size={14} />
                <span>{t('reset_filters') || 'Reset Filters'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters Select Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Month Selector Filter */}
          <div className="space-y-1.5 text-left">
            <label className="text-[11px] font-bold text-app-text-secondary uppercase tracking-wider flex items-center gap-1">
              <Calendar size={12} className="text-purple-400" />
              <span>{t('select_month') || 'Select Month'}</span>
            </label>
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="w-full py-2.5 px-3 bg-app-bg-input text-app-text-primary border border-app-border outline-none focus:border-purple-500 rounded-xl transition-all text-xs font-semibold cursor-pointer"
            >
              <option value="">{t('filter_month') || 'All Months'}</option>
              {filterMonths.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Selector Filter */}
          <div className="space-y-1.5 text-left">
            <label className="text-[11px] font-bold text-app-text-secondary uppercase tracking-wider flex items-center gap-1">
              <PlusCircle size={12} className="text-purple-400" />
              <span>{t('select_category_filter') || 'Select Category'}</span>
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full py-2.5 px-3 bg-app-bg-input text-app-text-primary border border-app-border outline-none focus:border-purple-500 rounded-xl transition-all text-xs font-semibold cursor-pointer"
            >
              <option value="ALL">{t('filter_category') || 'All Categories'}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  [{cat.type.toUpperCase()}] {t(cat.name)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Interactive Text Search Bar */}
        <div className="space-y-1.5 text-left">
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-app-text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search_ph')}
              className="w-full pl-10 pr-4 py-2.5 bg-app-bg-input text-app-text-primary border border-app-border focus:border-purple-500 outline-none rounded-xl text-xs font-semibold placeholder:text-app-text-secondary/50 transition-all"
            />
          </div>
        </div>

      </div>

      {/* Transactions Table Log */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-app-text-secondary gap-2">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-semibold tracking-wide">{t('syncing_ledger')}</span>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="p-4 bg-app-bg-input rounded-full text-app-text-secondary/60 mb-3">
              <Landmark size={40} />
            </div>
            <h4 className="text-sm font-bold text-app-text-primary mb-1">{t('no_transactions_found') || 'No transactions found'}</h4>
            <p className="text-xs text-app-text-secondary max-w-xs font-medium">
              {t('no_transactions_found_desc') || 'We couldn\'t find any financial entries matching your filters.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-app-border max-h-[520px] overflow-y-auto">
            {filteredTransactions.map((tx) => {
              const DynamicIcon = IconMap[tx.categories?.icon] || HelpCircle
              const isExpense = tx.type === 'expense'

              return (
                <div
                  key={tx.id}
                  className="relative overflow-hidden flex items-center justify-between p-4 hover:bg-app-bg-input-hover/30 transition-colors gap-3"
                >
                  {/* Premium absolute row overlay for delete confirmations */}
                  {deleteConfirmId === tx.id && (
                    <div className="absolute inset-0 bg-app-card-bg/95 backdrop-blur-md flex items-center justify-between px-4 py-2 z-10 animate-fade-in border border-rose-500/20 rounded-xl">
                      <span className="text-xs font-bold text-rose-500 dark:text-rose-400">
                        {t('delete_record_confirm')}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDelete(tx.id)}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[10px] sm:text-xs font-bold transition-all shadow shadow-rose-600/10 cursor-pointer active:translate-y-0.5"
                        >
                          {t('btn_confirm')}
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-3 py-1.5 bg-app-bg-input hover:bg-app-bg-input-hover border border-app-border text-app-text-primary rounded-lg text-[10px] sm:text-xs font-bold transition-all cursor-pointer"
                        >
                          {t('btn_cancel')}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Left Section: Category Icon & Metadata */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className="p-3 rounded-xl shrink-0 flex items-center justify-center animate-pulse-slow"
                      style={{
                        backgroundColor: `${tx.categories?.color || '#6B7280'}20`,
                        color: tx.categories?.color || '#6B7280',
                      }}
                    >
                      <DynamicIcon size={20} />
                    </div>

                    <div className="min-w-0 text-left">
                      <h4 className="text-sm font-semibold text-app-text-primary truncate">
                        {tx.description}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-app-text-secondary font-medium">
                        {tx.categories?.name === 'Kategori Lama' ? (
                          <span className="py-0.5 px-2 bg-rose-500/10 text-rose-500 dark:text-rose-400 rounded-full text-[9px] font-extrabold border border-rose-500/20 uppercase tracking-wider select-none shrink-0 leading-none">
                            {t('Kategori Lama')}
                          </span>
                        ) : (
                          <span>{tx.categories?.name ? t(tx.categories.name) : t('uncategorized')}</span>
                        )}
                        <span className="text-app-text-secondary/40 font-bold">•</span>
                        <span>{formatDate(tx.date)}</span>
                      </div>
                      {tx.notes && (
                        <p className="text-[11px] text-app-text-secondary/80 font-medium mt-1 border-l-2 border-app-border pl-1.5 truncate max-w-[180px] sm:max-w-xs md:max-w-sm">
                          {tx.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Section: Amount & Deletion */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-sm font-bold tracking-tight ${
                        isExpense ? 'text-rose-500 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {isExpense ? '-' : '+'}{formatRupiah(tx.amount)}
                    </span>

                    {/* Delete entry trigger button */}
                    <button
                      onClick={() => setDeleteConfirmId(tx.id)}
                      className="text-app-text-secondary hover:text-rose-500 hover:bg-app-bg-input-hover p-1.5 rounded-lg transition-colors hover:cursor-pointer"
                      title="Delete log"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}
