/**
 * KOS WALLET BUSINESS CALCULATION ENGINE
 * 
 * Why this file exists:
 * The user recommended that we do NOT couple dashboard calculations inside UI components.
 * Keeping calculations in a pure JavaScript utility file means:
 * 1. Zero dependencies: It's extremely fast and easy to read.
 * 2. High reusability: Any component (or test runner) can import these functions.
 * 3. Separation of Concerns: Components only render, utilities calculate.
 */

/**
 * Calculate the total sum of income transactions
 * @param {Array} transactions 
 * @returns {number}
 */
export const calculateTotalIncome = (transactions) => {
  if (!Array.isArray(transactions)) return 0
  return transactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0)
}

/**
 * Calculate the total sum of expense transactions
 * @param {Array} transactions 
 * @returns {number}
 */
export const calculateTotalExpenses = (transactions) => {
  if (!Array.isArray(transactions)) return 0
  return transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0)
}

/**
 * Calculate remaining money balance
 * @param {Array} transactions 
 * @returns {number}
 */
export const calculateRemainingBalance = (transactions) => {
  const income = calculateTotalIncome(transactions)
  const expenses = calculateTotalExpenses(transactions)
  return income - expenses
}

/**
 * Calculate expense aggregates by category
 * Format designed directly for Recharts input!
 * 
 * Example return:
 * [
 *   { name: 'Food', value: 350000, color: '#EF4444' },
 *   { name: 'Transportation', value: 120000, color: '#3B82F6' }
 * ]
 * 
 * @param {Array} transactions 
 * @returns {Array} List of category data objects for pie charts
 */
export const calculateExpensesByCategory = (transactions) => {
  if (!Array.isArray(transactions)) return []
  
  const expenseTransactions = transactions.filter((tx) => tx.type === 'expense')
  const categoriesMap = {}

  expenseTransactions.forEach((tx) => {
    // If the category is expanded/joined from Supabase, category_id might be a nested object
    const categoryName = tx.categories?.name || tx.category_name || 'Others'
    const color = tx.categories?.color || '#6B7280'
    const amount = Number(tx.amount || 0)

    if (!categoriesMap[categoryName]) {
      categoriesMap[categoryName] = {
        name: categoryName,
        value: 0,
        color: color,
      }
    }
    categoriesMap[categoryName].value += amount
  })

  return Object.values(categoriesMap)
}

/**
 * Get dynamic, humorous student-tailored budget alert status
 * 
 * @param {number} income Total monthly income / allowance
 * @param {number} expenses Total monthly expenses
 * @returns {Object} { statusName, description, themeColor, emoji }
 */
export const getKosWalletStatus = (income, expenses) => {
  if (income <= 0) {
    return {
      statusName: 'No Budget Set',
      description: 'Add your allowance to start budgeting!',
      themeColor: 'text-gray-500 bg-gray-500/10 border-gray-500/30',
      emoji: '🪙',
      key: 'no_budget'
    }
  }

  const remaining = income - expenses
  const remainingPercent = (remaining / income) * 100

  if (remainingPercent >= 50) {
    return {
      statusName: 'Aman Jaya (Makan Mewah)',
      description: 'Your wallet is healthy! Pizza or cafe sessions are approved.',
      themeColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30 dark:text-emerald-400',
      emoji: '😎',
      key: 'aman_jaya'
    }
  }
  
  if (remainingPercent >= 20) {
    return {
      statusName: 'Siaga Santai (Makan Warteg)',
      description: 'Moderate health. Stick to local foods and hold back on impulse purchases.',
      themeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/30 dark:text-amber-400',
      emoji: '🍛',
      key: 'siaga_santai'
    }
  }

  if (remainingPercent > 0) {
    return {
      statusName: 'Darurat Kost (Indomie Saja)',
      description: 'Critical balance! Time to stock up on instant noodles and walk to campus.',
      themeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      emoji: '🍜',
      key: 'darurat_kost'
    }
  }

  return {
    statusName: 'Kanker Stadium Akhir (Tanggal Tua)',
    description: 'Overbudget! You have spent more than you earned. Alert your parents immediately!',
    themeColor: 'text-rose-600 bg-rose-600/20 border-rose-600/40 dark:text-rose-500 animate-pulse',
    emoji: '💸',
    key: 'kanker'
  }
}

/**
 * Aggregate daily expense transactions for Area Charts
 * Returns sorted list of dates with spending sums
 * 
 * Example return:
 * [
 *   { date: '12 May', Amount: 30000 },
 *   { date: '15 May', Amount: 45000 }
 * ]
 * 
 * @param {Array} transactions 
 * @returns {Array} List of daily aggregated objects
 */
export const calculateDailySpendingTrend = (transactions) => {
  if (!Array.isArray(transactions)) return []

  const expenseTransactions = transactions.filter((tx) => tx.type === 'expense')
  const dailyMap = {}

  expenseTransactions.forEach((tx) => {
    if (!tx.date) return
    const d = new Date(tx.date)
    // Get a friendly representation like "21 May"
    const friendlyDate = d.toLocaleString('en-US', { day: 'numeric', month: 'short' })
    const amount = Number(tx.amount || 0)

    if (!dailyMap[tx.date]) {
      dailyMap[tx.date] = {
        rawDate: tx.date,
        date: friendlyDate,
        Amount: 0,
      }
    }
    dailyMap[tx.date].Amount += amount
  })

  // Sort chronologically by the raw date
  return Object.values(dailyMap)
    .sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate))
    .map((item) => ({
      date: item.date,
      Amount: item.Amount,
    }))
}

/**
 * Deterministically sort transactions in chronological descending order (latest -> oldest)
 * Prioritizes newest date, and breaks ties using newest Supabase created_at creation timestamps.
 * Utilizes immutable shallow copy patterns to prevent side effects on global states.
 * 
 * @param {Array} txList Unsorted transactions
 * @returns {Array} Deterministically sorted transactions
 */
export const sortTransactionsChronologically = (txList) => {
  if (!Array.isArray(txList)) return []
  
  return [...txList].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0
    const dateB = b.date ? new Date(b.date).getTime() : 0
    
    if (dateA !== dateB) {
      return dateB - dateA
    }
    
    const timeA = a.created_at ? new Date(a.created_at).getTime() : 0
    const timeB = b.created_at ? new Date(b.created_at).getTime() : 0
    
    return timeB - timeA
  })
}
