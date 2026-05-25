import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../services/supabase'
import { useAuth } from './useAuth'
import { useCategories } from './useCategories'
import { getMonthKey } from '../utils/formatters'

/**
 * TRANSACTIONS PROVIDER & HOOK
 * 
 * Why this exists:
 * The transactions state must be synchronised between the database and multiple UI components.
 * It integrates with useCategories to provide a unified financial data store.
 */

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

const enrichTransaction = (tx) => {
  let categoriesObj = tx.categories
  if (!categoriesObj && tx.category_id) {
    categoriesObj = DEFAULT_CATEGORIES.find(c => c.id === tx.category_id) || null
    if (!categoriesObj) {
      categoriesObj = { 
        id: tx.category_id, 
        name: 'Kategori Lama', 
        icon: 'HelpCircle', 
        color: '#6B7280', 
        type: tx.type,
        is_system: false
      }
    }
  }
  if (!categoriesObj && tx.category) {
    const catNameLower = tx.category.toLowerCase()
    categoriesObj = DEFAULT_CATEGORIES.find(c => {
      const nameMatch = c.name.toLowerCase() === catNameLower
      if (nameMatch) return true
      if (c.id === '00000000-0000-0000-0000-000000000001' && catNameLower === 'monthly allowance') return true
      if (c.id === '00000000-0000-0000-0000-000000000002' && catNameLower === 'other income') return true
      if (c.id === '00000000-0000-0000-0000-000000000004' && catNameLower === 'transportation') return true
      if (c.id === '00000000-0000-0000-0000-000000000005' && catNameLower === 'college needs') return true
      return false
    }) || null
  }
  return { ...tx, categories: categoriesObj }
}

const TransactionsContext = createContext(null)

export const TransactionsProvider = ({ children }) => {
  const { user } = useAuth()
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // 1. Fetch transaction logs with filter options
  const fetchTransactions = useCallback(async (filters = {}) => {
    if (!user) return
    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('transactions')
        .select('*, categories(*)')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })

      // Apply filter by Month Key (YYYY-MM) if specified
      if (filters.monthKey) {
        query = query.eq('month_key', filters.monthKey)
      }

      // Apply filter by Category ID if specified
      if (filters.categoryId) {
        query = query.eq('category_id', filters.categoryId)
      }

      const { data, error } = await query

      if (error) throw error
      
      const enriched = (data || []).map(enrichTransaction)
      setTransactions(enriched)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  // 2. Add a new transaction (Income or Expense)
  const addTransaction = async (txData) => {
    if (!user) return { data: null, error: 'User is not logged in!' }
    setLoading(true)
    setError(null)

    try {
      const monthKey = getMonthKey(txData.date)

      const payload = {
        user_id: user.id,
        amount: Number(txData.amount),
        type: txData.type, // 'income' or 'expense'
        category_id: txData.categoryId || null, // null if no category is picked
        description: txData.description,
        notes: txData.notes || '',
        date: txData.date,
        month_key: monthKey,
        recurring: txData.recurring || false,
      }

      const { data, error } = await supabase
        .from('transactions')
        .insert([payload])
        .select('*, categories(*)')

      if (error) throw error

      const enriched = enrichTransaction(data[0])

      // Optimistically append the new transaction to our state so the UI updates instantly!
      setTransactions((prev) => [enriched, ...prev])
      return { data: enriched, error: null }
    } catch (err) {
      setError(err.message)
      return { data: null, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // 3. Delete a transaction log
  const deleteTransaction = async (id) => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Filter out the deleted transaction from local state so we don't need a full database refetch!
      setTransactions((prev) => prev.filter((tx) => tx.id !== id))
      return { success: true, error: null }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Fetch user's transactions whenever their auth status changes
  useEffect(() => {
    if (user) {
      fetchTransactions()
    } else {
      setTransactions([])
    }
  }, [user, fetchTransactions])

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        categories,
        loading,
        categoriesLoading,
        error: error || categoriesError,
        addTransaction,
        deleteTransaction,
        refetchTransactions: fetchTransactions,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}

// Hook helper to consume Transactions values safely
export const useTransactions = () => {
  const context = useContext(TransactionsContext)
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionsProvider!')
  }
  return context
}

