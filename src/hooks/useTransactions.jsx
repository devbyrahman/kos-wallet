import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../services/supabase'
import { useAuth } from './useAuth'
import { getMonthKey } from '../utils/formatters'

/**
 * TRANSACTIONS PROVIDER & HOOK
 * 
 * Why this exists:
 * The transactions state must be synchronised between the database and multiple UI components
 * (the dashboard totals, the charts, and the transaction log list).
 * By creating a TransactionsContext, we centralize this data, preventing double-fetching and complex state lifting.
 * 
 * Beginner Concept - Supabase Joins:
 * To perform relational queries in Supabase (PostgreSQL), we write `.select('*, categories(*)')`.
 * This tells PostgreSQL to look up the `category_id` in our transaction table, find the matching
 * record in the `categories` table, and return it as a nested JSON object: `transaction.categories = { name, color, icon }`.
 */

// Local fallback categories to guarantee instant UI interactivity on offline first-boot.
// Using identical standard UUID v4 strings to prevent database constraint violations!
export const DEFAULT_CATEGORIES = [
  { id: '00000000-0000-0000-0000-000000000001', name: 'Monthly Allowance', icon: 'Wallet', color: '#10B981', type: 'income' },
  { id: '00000000-0000-0000-0000-000000000002', name: 'Other Income', icon: 'PlusCircle', color: '#3B82F6', type: 'income' },
  { id: '00000000-0000-0000-0000-000000000003', name: 'Food', icon: 'Utensils', color: '#EF4444', type: 'expense' },
  { id: '00000000-0000-0000-0000-000000000004', name: 'Transportation', icon: 'Car', color: '#3B82F6', type: 'expense' },
  { id: '00000000-0000-0000-0000-000000000005', name: 'College Needs', icon: 'BookOpen', color: '#10B981', type: 'expense' },
  { id: '00000000-0000-0000-0000-000000000006', name: 'Internet', icon: 'Wifi', color: '#F59E0B', type: 'expense' },
  { id: '00000000-0000-0000-0000-000000000007', name: 'Entertainment', icon: 'Gamepad2', color: '#8B5CF6', type: 'expense' },
  { id: '00000000-0000-0000-0000-000000000008', name: 'Emergency', icon: 'Flame', color: '#EC4899', type: 'expense' },
  { id: '00000000-0000-0000-0000-000000000009', name: 'Others', icon: 'PiggyBank', color: '#6B7280', type: 'expense' }
]

const TransactionsContext = createContext(null)

export const TransactionsProvider = ({ children }) => {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES) // Start with fallbacks as initial state!
  const [loading, setLoading] = useState(false)
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const [error, setError] = useState(null)

  // 1. Fetch available transaction categories (Food, Transportation, Allowance, etc.)
  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true)
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      
      if (data && data.length > 0) {
        setCategories(data)
      } else {
        setCategories(DEFAULT_CATEGORIES)
      }
    } catch (err) {
      console.warn('Supabase fetch categories failed, operating on fallback defaults:', err.message)
      setCategories(DEFAULT_CATEGORIES)
    } finally {
      setCategoriesLoading(false)
    }
  }, [])

  // 2. Fetch transaction logs with filter options
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
      setTransactions(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  // 3. Add a new transaction (Income or Expense)
  const addTransaction = async (txData) => {
    if (!user) return { data: null, error: 'User is not logged in!' }
    setLoading(true)
    setError(null)

    try {
      // Beginners tip: Always derive monthly queries using a month_key (YYYY-MM).
      // We calculate this directly from the transaction date so we don't have to parse strings.
      const monthKey = getMonthKey(txData.date)

      const payload = {
        user_id: user.id,
        amount: Number(txData.amount),
        type: txData.type, // 'income' or 'expense'
        category_id: txData.categoryId || null, // null for generic income or if no category is picked
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

      // Optimistically append the new transaction to our state so the UI updates instantly!
      setTransactions((prev) => [data[0], ...prev])
      return { data: data[0], error: null }
    } catch (err) {
      setError(err.message)
      return { data: null, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // 4. Delete a transaction log
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

  // Fetch categories once on provider initialization
  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

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
        error,
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
