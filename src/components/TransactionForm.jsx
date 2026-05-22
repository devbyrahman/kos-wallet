import React, { useState, useEffect } from 'react'
import { useTransactions } from '../hooks/useTransactions'
import { useLanguage } from '../hooks/useLanguage'
import { PlusCircle, MinusCircle, X, Loader2, Calendar, FileText } from 'lucide-react'

/**
 * TRANSACTION FORM COMPONENT (Modal)
 * 
 * Why this component exists:
 * Handles adding new financial entries (both incomes like allowance, and expenses like food or internet).
 * It runs inside a modal to save screen space and provide a premium focal interface.
 * 
 * Logic Highlights:
 * - Dynamically filters categories based on type selection ('income' vs 'expense').
 * - Validates amounts to ensure they are positive numbers.
 * - Sets the default date to today (`YYYY-MM-DD`).
 * 
 * Beginner Concept - Form Resets and Closures:
 * When a modal is closed, we need to reset the form states back to initial values so that
 * when it reopens, old values are not left behind. We handle this inside `handleClose`.
 */

export default function TransactionForm({ isOpen, onClose }) {
  const { categories, addTransaction, loading } = useTransactions()
  const { t } = useLanguage()

  const [type, setType] = useState('expense') // 'expense' or 'income'
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]) // default YYYY-MM-DD
  const [notes, setNotes] = useState('')
  const [recurring, setRecurring] = useState(false)
  
  const [validationError, setValidationError] = useState(null)

  // Dynamically filter categories based on whether user is adding an income or expense
  const filteredCategories = categories.filter((cat) => cat.type === type)

  // Automatically select the first category in the filtered list when the type changes
  useEffect(() => {
    if (filteredCategories.length > 0) {
      setCategoryId(filteredCategories[0].id)
    } else {
      setCategoryId('')
    }
  }, [type, categories])

  // Prevent background scroll bleed when the modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleClose = () => {
    // Reset states
    setType('expense')
    setAmount('')
    setDescription('')
    setDate(new Date().toISOString().split('T')[0])
    setNotes('')
    setRecurring(false)
    setValidationError(null)
    onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setValidationError(null)

    const numAmount = Number(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      setValidationError(t('val_amount') || 'Amount must be a positive number greater than zero!')
      return
    }
    if (!description.trim()) {
      setValidationError(t('val_desc') || 'Please enter a description.')
      return
    }
    if (!categoryId) {
      setValidationError(t('val_category') || 'Please select a category.')
      return
    }

    const { error } = await addTransaction({
      amount: numAmount,
      type,
      categoryId,
      description: description.trim(),
      notes: notes.trim(),
      date,
      recurring,
    })

    if (error) {
      setValidationError(error)
    } else {
      handleClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm animate-fade-in select-none">
      
      <div className="min-h-dvh w-full flex items-end sm:items-center justify-center p-0 sm:p-4">
        
        {/* Modal card - Transitions from mobile bottom sheet to centered desktop dialog */}
        <div className="glass-panel w-full max-w-lg rounded-t-2xl sm:rounded-2xl p-6 relative overflow-hidden shadow-2xl pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:pb-6">
          
          {/* Dynamic header colors depending on type */}
          <div className="flex items-center justify-between pb-4 border-b border-app-border mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-app-text-primary">
              {type === 'expense' ? (
                <MinusCircle className="text-rose-500" size={24} />
              ) : (
                <PlusCircle className="text-emerald-500" size={24} />
              )}
              <span>{t('new_transaction')}</span>
            </h2>
            <button
              onClick={handleClose}
              className="text-app-text-secondary hover:text-app-text-primary hover:bg-app-bg-input-hover p-2 rounded-lg transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {validationError && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 text-xs font-semibold">
              {validationError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            
            {/* Income vs Expense Selection Tabs */}
            <div className="grid grid-cols-2 p-1 bg-app-bg-input rounded-xl border border-app-border">
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`py-2 px-3 sm:py-2.5 sm:px-4 rounded-lg font-bold text-[10px] sm:text-xs tracking-wider transition-all cursor-pointer ${
                  type === 'expense'
                    ? 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20 shadow'
                    : 'text-app-text-secondary hover:text-app-text-primary hover:bg-app-bg-input-hover/50'
                }`}
              >
                {t('type_expense').toUpperCase()}
              </button>
              <button
                type="button"
                onClick={() => setType('income')}
                className={`py-2 px-3 sm:py-2.5 sm:px-4 rounded-lg font-bold text-[10px] sm:text-xs tracking-wider transition-all cursor-pointer ${
                  type === 'income'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow'
                    : 'text-app-text-secondary hover:text-app-text-primary hover:bg-app-bg-input-hover/50'
                }`}
              >
                {t('type_income').toUpperCase()}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Amount Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-app-text-secondary uppercase tracking-wider">
                  {t('amount')}
                </label>
                <input
                  type="number"
                  placeholder="e.g. 25000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={loading}
                  className="w-full py-2.5 px-3 bg-app-bg-input text-app-text-primary placeholder-slate-400 dark:placeholder-slate-500 border border-app-border outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm font-semibold rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
                  required
                />
              </div>

              {/* Date Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-app-text-secondary uppercase tracking-wider flex items-center gap-1">
                  <Calendar size={13} />
                  <span>{t('date')}</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={loading}
                  className="w-full py-2.5 px-3 bg-app-bg-input text-app-text-primary border border-app-border outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm font-semibold cursor-pointer rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Description Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-app-text-secondary uppercase tracking-wider">
                  {t('description')}
                </label>
                <input
                  type="text"
                  placeholder={type === 'expense' ? t('description_ph') : 'e.g. Allowance from Parents'}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                  className="w-full py-2.5 px-3 bg-app-bg-input text-app-text-primary placeholder-slate-400 dark:placeholder-slate-500 border border-app-border outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm font-medium rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
                  required
                />
              </div>

              {/* Category Dropdown Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-app-text-secondary uppercase tracking-wider">
                  {t('category')}
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  disabled={loading}
                  className="w-full py-2.5 px-3 bg-app-bg-input text-app-text-primary border border-app-border outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm font-semibold cursor-pointer rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
                  required
                >
                  {filteredCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {t(cat.name)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Optional Notes Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-app-text-secondary uppercase tracking-wider flex items-center gap-1">
                <FileText size={13} />
                <span>{t('notes')}</span>
              </label>
              <textarea
                placeholder={t('notes_ph') || "Add more details about this transaction..."}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={loading}
                rows={2}
                className="w-full py-2.5 px-3 bg-app-bg-input text-app-text-primary placeholder-slate-400 dark:placeholder-slate-500 border border-app-border outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm font-medium resize-none rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            {/* Future-proofing: Recurring Flag Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="recurring"
                checked={recurring}
                onChange={(e) => setRecurring(e.target.checked)}
                disabled={loading}
                className="w-4 h-4 rounded border-app-border bg-app-bg-input text-purple-600 focus:ring-purple-500 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <label htmlFor="recurring" className="text-xs text-app-text-secondary font-semibold select-none cursor-pointer">
                {t('recurring_label') || "Is this a recurring monthly transaction?"}
              </label>
            </div>

            {/* Submit Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-app-border mt-6">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 py-3 px-4 bg-app-bg-input hover:bg-app-bg-input-hover border border-app-border text-app-text-primary font-bold text-xs tracking-wider rounded-xl transition-all hover:cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {t('btn_cancel')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-3 px-4 text-white font-bold text-xs tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 hover:cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                  type === 'expense'
                    ? 'bg-rose-600 hover:bg-rose-500 disabled:bg-rose-800'
                    : 'bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>{t('btn_saving')}</span>
                  </>
                ) : (
                  <span>{t('btn_save')}</span>
                )}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  )
}
