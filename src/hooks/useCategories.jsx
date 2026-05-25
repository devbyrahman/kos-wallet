import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../services/supabase'
import { useAuth } from './useAuth'

export const DEFAULT_CATEGORIES = [
  { id: '00000000-0000-0000-0000-000000000001', name: 'Monthly Allowance', icon: 'Wallet', color: '#10B981', type: 'income', is_system: true },
  { id: '00000000-0000-0000-0000-000000000002', name: 'Other Income', icon: 'PlusCircle', color: '#3B82F6', type: 'income', is_system: true },
  { id: '00000000-0000-0000-0000-000000000003', name: 'Food', icon: 'Utensils', color: '#EF4444', type: 'expense', is_system: true },
  { id: '00000000-0000-0000-0000-000000000004', name: 'Transportation', icon: 'Car', color: '#3B82F6', type: 'expense', is_system: true },
  { id: '00000000-0000-0000-0000-000000000005', name: 'College Needs', icon: 'BookOpen', color: '#10B981', type: 'expense', is_system: true },
  { id: '00000000-0000-0000-0000-000000000006', name: 'Internet', icon: 'Wifi', color: '#F59E0B', type: 'expense', is_system: true },
  { id: '00000000-0000-0000-0000-000000000007', name: 'Entertainment', icon: 'Gamepad2', color: '#8B5CF6', type: 'expense', is_system: true },
  { id: '00000000-0000-0000-0000-000000000008', name: 'Emergency', icon: 'Flame', color: '#EC4899', type: 'expense', is_system: true },
  { id: '00000000-0000-0000-0000-000000000009', name: 'Others', icon: 'PiggyBank', color: '#6B7280', type: 'expense', is_system: true }
]

export const mergeDefaultAndCustomCategories = (customs = []) => {
  const merged = [...DEFAULT_CATEGORIES]
  const seenNames = new Set(DEFAULT_CATEGORIES.map(c => c.name.trim().toLowerCase()))
  
  customs.forEach(c => {
    const norm = (c.name || '').trim().toLowerCase()
    if (norm && !seenNames.has(norm)) {
      seenNames.add(norm)
      merged.push({ ...c, is_system: false })
    }
  })
  
  return merged
}

const CategoriesContext = createContext(null)

export const CategoriesProvider = ({ children }) => {
  const { user } = useAuth()
  const [customCategories, setCustomCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Budget state synchronized with localStorage
  const [budgets, setBudgets] = useState(() => {
    try {
      const saved = localStorage.getItem('kos_wallet_category_budgets')
      return saved ? JSON.parse(saved) : {
        'Food': 600000,
        'Transportation': 200000,
        'College Needs': 400000,
        'Internet': 150000,
        'Entertainment': 250000,
        'Emergency': 500000,
        'Others': 150000
      }
    } catch (e) {
      console.warn('Failed to parse budget limits from localStorage:', e)
      return {
        'Food': 600000,
        'Transportation': 200000,
        'College Needs': 400000,
        'Internet': 150000,
        'Entertainment': 250000,
        'Emergency': 500000,
        'Others': 150000
      }
    }
  })

  const saveBudgetLimit = (categoryName, limitAmount) => {
    const rawNum = Number(limitAmount)
    const amount = isNaN(rawNum) || rawNum < 0 ? 0 : rawNum
    
    const updated = {
      ...budgets,
      [categoryName]: amount
    }
    setBudgets(updated)
    localStorage.setItem('kos_wallet_category_budgets', JSON.stringify(updated))
  }

  const fetchCustomCategories = useCallback(async () => {
    if (!user) {
      setCustomCategories([])
      return
    }
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true })

      if (error) {
        if (error.message?.includes('column "user_id" of relation "categories" does not exist') || error.code === 'PGRST204') {
          console.warn('⚠️ Supabase categories table does not have user_id column yet. Please run the SQL migration in Supabase SQL editor!')
        }
        throw error
      }
      setCustomCategories(data || [])
    } catch (err) {
      console.error('Failed to fetch custom categories from Supabase:', err.message)
      setError(err.message)
      setCustomCategories([])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchCustomCategories()
  }, [fetchCustomCategories])

  const addCategory = async (name, type, icon = 'wallet', color = '#8b5cf6') => {
    if (!user) return { success: false, error: 'User is not logged in!' }
    
    const trimmedName = (name || '').trim()
    if (!trimmedName) {
      return { success: false, error: 'Category name cannot be empty!' }
    }
    if (trimmedName.length > 20) {
      return { success: false, error: 'Category name must not exceed 20 characters!' }
    }

    // Duplicate check
    const merged = mergeDefaultAndCustomCategories(customCategories)
    const exists = merged.some(c => c.name.trim().toLowerCase() === trimmedName.toLowerCase())
    if (exists) {
      return { success: false, error: 'Category name already exists!' }
    }

    setLoading(true)
    setError(null)

    try {
      const payload = {
        user_id: user.id,
        name: trimmedName,
        type,
        icon,
        color,
        is_system: false
      }

      const { data, error } = await supabase
        .from('categories')
        .insert([payload])
        .select('*')

      if (error) throw error

      if (data && data.length > 0) {
        setCustomCategories(prev => [...prev, data[0]].sort((a, b) => a.name.localeCompare(b.name)))
        return { success: true, data: data[0], error: null }
      }
      return { success: false, error: 'Unexpected error inserting category' }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const deleteCategory = async (id) => {
    if (!user) return { success: false, error: 'User is not logged in!' }

    // Check if system default category
    const isDefault = DEFAULT_CATEGORIES.some(c => c.id === id)
    if (isDefault) {
      return { success: false, error: 'Cannot delete system default categories!' }
    }

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      setCustomCategories(prev => prev.filter(c => c.id !== id))
      return { success: true, error: null }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Normalize every category object before rendering
  const mergedCategories = mergeDefaultAndCustomCategories(customCategories).map(cat => {
    const budgetVal = budgets[cat.name] !== undefined ? budgets[cat.name] : 0
    const safeBudget = isNaN(Number(budgetVal)) || Number(budgetVal) < 0 ? 0 : Number(budgetVal)
    
    return {
      id: cat.id || '',
      name: cat.name || 'Others',
      type: cat.type || 'expense',
      color: cat.color || '#8b5cf6',
      icon: cat.icon || 'wallet',
      budget: safeBudget,
      is_system: cat.is_system || cat.id.startsWith('00000000-0000-0000-0000-00000000000') || false
    }
  })

  return (
    <CategoriesContext.Provider
      value={{
        categories: mergedCategories,
        customCategories,
        budgets,
        saveBudgetLimit,
        loading,
        error,
        addCategory,
        deleteCategory,
        refreshCategories: fetchCustomCategories
      }}
    >
      {children}
    </CategoriesContext.Provider>
  )
}

export const useCategories = () => {
  const context = useContext(CategoriesContext)
  if (!context) {
    throw new Error('useCategories must be used within a CategoriesProvider!')
  }
  return context
}
