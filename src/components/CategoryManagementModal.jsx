import React, { useState } from 'react'
import { useCategories } from '../hooks/useCategories'
import { useTransactions } from '../hooks/useTransactions'
import { useLanguage } from '../hooks/useLanguage'
import { 
  X, 
  Trash2, 
  Plus, 
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
  Sparkles,
  AlertTriangle,
  Loader2,
  Check
} from 'lucide-react'

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

const COLOR_PRESETS = [
  '#EF4444', // Red
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#6B7280', // Gray
  '#14B8A6', // Teal
  '#F97316'  // Orange
]

const ICON_PRESETS = Object.keys(IconMap)

export default function CategoryManagementModal({ isOpen, onClose }) {
  const { categories, addCategory, deleteCategory, loading: categoriesLoading } = useCategories()
  const { transactions } = useTransactions()
  const { t, language } = useLanguage()

  // Form states
  const [tab, setTab] = useState('expense') // 'expense' or 'income'
  const [name, setName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('Wallet')
  const [selectedColor, setSelectedColor] = useState('#8B5CF6')
  const [validationError, setValidationError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  // Deletion danger dialog overlay states
  const [pendingDeleteCat, setPendingDeleteCat] = useState(null)
  const [deleteBlocked, setDeleteBlocked] = useState(false)

  if (!isOpen) return null

  // Filter categories matching the current tab
  const tabCategories = categories.filter(c => c.type === tab)

  const handleAdd = async (e) => {
    e.preventDefault()
    setValidationError(null)
    setSuccessMessage(null)

    const trimmed = name.trim()
    if (!trimmed) {
      setValidationError(t('empty_category_err') || 'Category name cannot be empty!')
      return
    }

    if (trimmed.length > 20) {
      setValidationError(t('max_char_err') || 'Maximum 20 characters!')
      return
    }

    // Call provider addCategory
    const result = await addCategory(trimmed, tab, selectedIcon, selectedColor)
    if (!result.success) {
      setValidationError(result.error)
    } else {
      setName('')
      setSuccessMessage(t('category_added_success') || 'Category successfully added!')
      setTimeout(() => setSuccessMessage(null), 2500)
    }
  }

  const handleDeleteClick = (cat) => {
    // Check if system default category
    if (cat.is_system) {
      alert(t('default_cat_delete_err'))
      return
    }

    // Count transactions using this category
    const matchingCount = transactions.filter(tx => tx.category_id === cat.id).length
    setPendingDeleteCat(cat)
    if (matchingCount > 0) {
      setDeleteBlocked(true)
    } else {
      setDeleteBlocked(false)
    }
  }

  const executeDelete = async (id) => {
    const result = await deleteCategory(id)
    if (!result.success) {
      alert(t('err_delete_category', { error: result.error }))
    }
    setPendingDeleteCat(null)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm animate-fade-in flex items-end sm:items-center justify-center p-0 sm:p-4 select-none">
      
      {/* Warning / Confirmation Alert Overlay Dialog */}
      {pendingDeleteCat && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl shadow-2xl border border-app-border text-left relative overflow-hidden bg-slate-900/90 dark:bg-slate-950/90">
            {deleteBlocked ? (
              // BLOCKED DELETE WARNING (Category in use!)
              <>
                <div className="flex items-center gap-3 text-rose-500 mb-4">
                  <AlertTriangle size={24} className="shrink-0" />
                  <h3 className="text-base font-bold text-app-text-primary">
                    {t('delete_warning_title') || 'Delete Blocked'}
                  </h3>
                </div>
                
                <p className="text-xs text-app-text-secondary leading-relaxed font-semibold mb-6">
                  {t('category_in_use_warning') || 'Kategori masih digunakan oleh transaksi.'}
                </p>

                <div className="flex">
                  <button
                    onClick={() => setPendingDeleteCat(null)}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs tracking-wider rounded-xl transition-all shadow cursor-pointer text-center"
                  >
                    OK
                  </button>
                </div>
              </>
            ) : (
              // CONFIRMATION DIALOG (Safe to delete!)
              <>
                <div className="flex items-center gap-3 text-amber-500 mb-4">
                  <AlertTriangle size={24} className="shrink-0" />
                  <h3 className="text-base font-bold text-app-text-primary">
                    {t('delete_category') || 'Delete Category'}
                  </h3>
                </div>
                
                <p className="text-xs text-app-text-secondary leading-relaxed font-semibold mb-6">
                  {t('delete_category_confirm', { name: t(pendingDeleteCat.name) })}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => executeDelete(pendingDeleteCat.id)}
                    className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs tracking-wider rounded-xl transition-all shadow cursor-pointer"
                  >
                    {t('btn_delete') || 'DELETE'}
                  </button>
                  <button
                    onClick={() => setPendingDeleteCat(null)}
                    className="flex-1 py-2.5 bg-app-bg-input hover:bg-app-bg-input-hover border border-app-border text-app-text-primary font-bold text-xs tracking-wider rounded-xl transition-all cursor-pointer"
                  >
                    {t('btn_cancel') || 'CANCEL'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Main Modal Card */}
      <div className="glass-panel w-full max-w-2xl rounded-t-2xl sm:rounded-2xl relative overflow-hidden shadow-2xl pb-[calc(1.2rem+env(safe-area-inset-bottom))] sm:pb-5 max-h-[85dvh] sm:max-h-[90dvh] flex flex-col bg-slate-900/95 dark:bg-slate-950/95">
        
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-slate-900/95 dark:bg-slate-950/95 px-5 pt-5 pb-3.5 border-b border-app-border shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-app-text-primary flex items-center gap-2">
                <Sparkles className="text-purple-400 shrink-0" size={18} />
                <span>{t('manage_categories') || 'Manage Categories'}</span>
              </h2>
              <p className="text-[10px] sm:text-xs text-app-text-secondary mt-0.5">
                {t('manage_categories_desc')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-app-text-secondary hover:text-app-text-primary hover:bg-app-bg-input-hover p-2 rounded-lg transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Scroll Content */}
        <div className="overflow-y-auto px-5 py-4 flex-1 space-y-5 flex flex-col md:flex-row gap-6">
          
          {/* LEFT COLUMN: ADD CATEGORY FORM */}
          <div className="md:w-1/2 space-y-4">
            
            {/* Income / Expense Tabs */}
            <div className="grid grid-cols-2 p-1 bg-app-bg-input rounded-xl border border-app-border shrink-0">
              <button
                type="button"
                onClick={() => setTab('expense')}
                className={`py-2 rounded-lg font-bold text-[10px] sm:text-xs tracking-wider transition-all cursor-pointer ${
                  tab === 'expense'
                    ? 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20 shadow'
                    : 'text-app-text-secondary hover:text-app-text-primary hover:bg-app-bg-input-hover/50'
                }`}
              >
                {t('type_expense')?.toUpperCase() || 'EXPENSE'}
              </button>
              <button
                type="button"
                onClick={() => setTab('income')}
                className={`py-2 rounded-lg font-bold text-[10px] sm:text-xs tracking-wider transition-all cursor-pointer ${
                  tab === 'income'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow'
                    : 'text-app-text-secondary hover:text-app-text-primary hover:bg-app-bg-input-hover/50'
                }`}
              >
                {t('type_income')?.toUpperCase() || 'INCOME'}
              </button>
            </div>

            {/* Error / Success Alerts */}
            {validationError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 text-[10px] font-semibold animate-shake">
                {validationError}
              </div>
            )}
            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold">
                {successMessage}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAdd} className="space-y-4 text-left">
              
              {/* Category Name Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-app-text-secondary uppercase tracking-wider block">
                  {t('category_name') || 'Category Name'}
                </label>
                <input
                  type="text"
                  placeholder={t('category_name_ph')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={categoriesLoading}
                  maxLength={20}
                  className="w-full py-2.5 px-3 bg-app-bg-input text-app-text-primary border border-app-border outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-xs font-semibold rounded-xl"
                  required
                />
              </div>

              {/* Color Preset Picker */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-app-text-secondary uppercase tracking-wider block">
                  {t('color') || 'Color Theme'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_PRESETS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      style={{ backgroundColor: color }}
                      className="w-6 h-6 rounded-full border border-slate-900/10 dark:border-slate-50/15 cursor-pointer flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                    >
                      {selectedColor === color && (
                        <Check size={12} className="text-white drop-shadow" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Icon Preset Grid Picker */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-app-text-secondary uppercase tracking-wider block">
                  {t('icon') || 'Select Icon'}
                </label>
                <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 p-3 bg-app-bg-input rounded-xl border border-app-border">
                  {ICON_PRESETS.map(iconName => {
                    const PickerIcon = IconMap[iconName] || HelpCircle
                    const isActive = selectedIcon === iconName
                    return (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => setSelectedIcon(iconName)}
                        className={`p-2 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                          isActive 
                            ? 'bg-purple-600 text-white shadow-md' 
                            : 'text-app-text-secondary hover:text-app-text-primary hover:bg-app-bg-input-hover'
                        }`}
                      >
                        <PickerIcon size={16} />
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={categoriesLoading}
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs tracking-wider rounded-xl transition-all shadow-md active:translate-y-0.5 disabled:opacity-60 cursor-pointer flex items-center justify-center gap-1.5"
              >
                {categoriesLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>{t('btn_saving') || 'Saving Category...'}</span>
                  </>
                ) : (
                  <>
                    <Plus size={14} />
                    <span>{t('add_category')?.toUpperCase() || 'ADD CATEGORY'}</span>
                  </>
                )}
              </button>

            </form>
          </div>

          {/* RIGHT COLUMN: LIST AND MANAGEMENT */}
          <div className="md:w-1/2 flex flex-col min-h-[300px]">
            <h3 className="text-[10px] font-bold text-app-text-secondary uppercase tracking-wider block text-left mb-2">
              {tab === 'expense' ? t('category_list_expense') : t('category_list_income')}
            </h3>
            
            <div className="flex-1 bg-app-bg-input/40 border border-app-border rounded-2xl overflow-y-auto divide-y divide-app-border p-1 max-h-[340px] scrollbar-thin">
              {tabCategories.map(cat => {
                const ItemIcon = IconMap[cat.icon] || HelpCircle

                return (
                  <div 
                    key={cat.id} 
                    className="flex items-center justify-between p-3.5 transition-colors hover:bg-app-bg-input-hover/30 gap-3 rounded-xl"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Color Icon badge */}
                      <div 
                        className="p-2.5 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: `${cat.color || '#6B7280'}20`,
                          color: cat.color || '#6B7280'
                        }}
                      >
                        <ItemIcon size={15} />
                      </div>
                      <span className="text-xs font-bold text-app-text-primary truncate">
                        {t(cat.name)}
                      </span>
                    </div>

                    <div className="shrink-0 flex items-center">
                      {cat.is_system ? (
                        <span className="text-[8px] tracking-wider font-extrabold uppercase py-1 px-2.5 bg-slate-500/10 text-app-text-secondary/70 rounded-full border border-app-border/40 select-none">
                          System
                        </span>
                      ) : (
                        <button
                          onClick={() => handleDeleteClick(cat)}
                          className="p-2 text-app-text-secondary hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
              
              {tabCategories.length === 0 && (
                <div className="p-8 text-center text-[11px] text-app-text-secondary font-semibold">
                  {t('no_categories_tab')}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
