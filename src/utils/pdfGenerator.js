import { calculateTotalIncome, calculateTotalExpenses, calculateRemainingBalance, calculateExpensesByCategory } from './calculations'
import { formatRupiah, formatDate, getMonthKey } from './formatters'

/**
 * scale PDF Generation Utility
 * 
 * Rationale:
 * Separates heavy Canvas draw coordinates and page metrics from visual React components.
 * Utilizes dynamic lazy imports inside the generate function so jsPDF and jspdf-autotable
 * are ONLY loaded in the browser when the student triggers the export, keeping the initial
 * application bundle extremely small and fast.
 */

// Helper to calculate previous month YYYY-MM key safely
const getPreviousMonthKey = (monthKey) => {
  if (!monthKey) return ''
  const [year, month] = monthKey.split('-').map(Number)
  let prevYear = year
  let prevMonth = month - 1
  if (prevMonth === 0) {
    prevMonth = 12
    prevYear = year - 1
  }
  return `${prevYear}-${String(prevMonth).padStart(2, '0')}`
}

// Helper to determine the total days in a month YYYY-MM
const getDaysInMonth = (monthKey) => {
  if (!monthKey) return 30
  const [year, month] = monthKey.split('-').map(Number)
  return new Date(year, month, 0).getDate()
}

/**
 * Compile and trigger PDF download
 */
export const generateMonthlyPDF = async ({ profile, transactions, categories, monthFilter, t, allTransactions }) => {
  console.log('PDF EXPORT ENGINE: Started generation process...');
  
  // 1. DYNAMIC LAZY IMPORTS - Keeps main JS bundle tiny!
  console.log('PDF EXPORT ENGINE: Loading jsPDF and jspdf-autotable dynamically...');
  const { jsPDF } = await import('jspdf')
  const autoTable = (await import('jspdf-autotable')).default
  console.log('PDF EXPORT ENGINE: Dynamic imports resolved successfully!');

  // Filter transactions for the selected month to perform aggregates
  console.log('PDF EXPORT ENGINE: Preparing transactions data for calculations...');
  const monthTransactions = transactions.filter(tx => !monthFilter || tx.month_key === monthFilter)
  
  const currentIncome = calculateTotalIncome(monthTransactions)
  const currentExpenses = calculateTotalExpenses(monthTransactions)
  const currentBalance = calculateRemainingBalance(monthTransactions)
  console.log(`PDF EXPORT ENGINE: Data aggregates prepared - Income: ${currentIncome}, Expenses: ${currentExpenses}, Balance: ${currentBalance}`);

  // 2. FINANCIAL INSIGHTS MATH ENGINE
  console.log('PDF EXPORT ENGINE: Generating financial metrics and budget alert insights...');
  // A. Largest Category
  const breakdown = calculateExpensesByCategory(monthTransactions)
  let largestCategoryName = '-'
  let maxSpent = 0
  breakdown.forEach(item => {
    if (item.value > maxSpent) {
      maxSpent = item.value
      largestCategoryName = item.name
    }
  })
  const largestCategory = largestCategoryName !== '-' ? t(largestCategoryName) : '-'

  // B. Average Daily Expense
  const totalDays = getDaysInMonth(monthFilter)
  const averageDaily = totalDays > 0 ? currentExpenses / totalDays : 0

  // C. Expense Trend vs Previous Month
  const prevMonthKey = getPreviousMonthKey(monthFilter)
  const prevMonthTx = allTransactions.filter(tx => tx.month_key === prevMonthKey)
  const prevExpenses = calculateTotalExpenses(prevMonthTx)
  
  let trendLabel = ''
  if (prevExpenses === 0) {
    trendLabel = t('trend_na') || 'N/A'
  } else {
    const diffPercent = ((currentExpenses - prevExpenses) / prevExpenses) * 100
    const sign = diffPercent > 0 ? '+' : ''
    trendLabel = `${sign}${diffPercent.toFixed(1)}% vs ${t('prev_month') || 'prev month'}`
  }

  // D. Budget Limit Exceedance Count
  let budgets = {}
  try {
    const saved = localStorage.getItem('kos_wallet_category_budgets')
    if (saved) budgets = JSON.parse(saved)
  } catch (e) {
    console.warn('Failed to parse budget limits from localStorage:', e)
  }

  let overBudgetCount = 0
  let totalBudgeted = 0
  const categoryExpenses = {}
  monthTransactions
    .filter(tx => tx.type === 'expense')
    .forEach(tx => {
      const catName = tx.categories?.name || tx.category_name || 'Others'
      const amount = Number(tx.amount || 0)
      categoryExpenses[catName] = (categoryExpenses[catName] || 0) + amount
    })

  const expenseCategories = categories.filter(cat => cat.type === 'expense')
  expenseCategories.forEach(cat => {
    const spent = categoryExpenses[cat.name] || 0
    const limit = budgets[cat.name] || 0
    if (limit > 0) {
      totalBudgeted++
      if (spent > limit) {
        overBudgetCount++
      }
    }
  })

  let budgetStatusText = ''
  if (totalBudgeted === 0) {
    budgetStatusText = t('budget_status_none') || 'No Limits Set'
  } else if (overBudgetCount === 0) {
    budgetStatusText = t('budget_status_all_safe') || 'All Categories Safe'
  } else {
    budgetStatusText = `${overBudgetCount} ${t('budget_status_over') || 'Over Limit'}`
  }
  console.log('PDF EXPORT ENGINE: Insights calculation finished successfully.');

  // 3. CANVAS LAYOUT GENERATOR (Clean light theme)
  console.log('PDF EXPORT ENGINE: Constructing PDF canvas and drawing branding items...');
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  doc.setFont('helvetica')
  const marginX = 15
  let currentY = 20

  // A. BRANDING HEADER
  // Draw purple wallet icon logo box
  doc.setFillColor(139, 92, 246) // #8b5cf6
  doc.roundedRect(marginX, currentY, 8, 8, 2, 2, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(5)
  doc.setFont('helvetica', 'bold')
  doc.text('W', marginX + 3.5, currentY + 5.5)

  // Brand Name
  doc.setTextColor(139, 92, 246)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Kos Wallet', marginX + 11, currentY + 6.5)

  // Document Title
  doc.setTextColor(15, 23, 42) // slate-900
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text((t('monthly_report_title') || 'MONTHLY FINANCIAL REPORT').toUpperCase(), 195, currentY + 6.5, { align: 'right' })

  // Student Profile details
  currentY += 14
  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(71, 85, 105) // slate-600
  doc.text(`${t('student') || 'Student'}: ${profile?.full_name || 'Student'}`, marginX, currentY)
  
  // Dynamic Month Label
  const displayMonth = monthFilter 
    ? new Date(monthFilter + '-02').toLocaleString('en-US', { month: 'long', year: 'numeric' })
    : t('filter_month') || 'All Months'
  doc.text(`${t('period') || 'Period'}: ${displayMonth}`, marginX, currentY + 4)
  
  // Timestamp
  const formattedTimestamp = new Date().toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  doc.text(`${t('generated_on') || 'Generated'}: ${formattedTimestamp}`, 195, currentY, { align: 'right' })

  // Header bottom border line
  currentY += 8
  doc.setDrawColor(226, 232, 240) // slate-200
  doc.setLineWidth(0.5)
  doc.line(marginX, currentY, 195, currentY)

  // B. FINANCIAL SUMMARY CARD BLOCKS
  console.log('PDF EXPORT ENGINE: Drawing summaries card boxes...');
  currentY += 6
  const drawSummaryCard = (x, title, value, valColorRGB) => {
    // Shaded boundary rectangle
    doc.setFillColor(248, 250, 252) // slate-50
    doc.setDrawColor(226, 232, 240) // slate-200
    doc.setLineWidth(0.3)
    doc.roundedRect(x, currentY, 56, 18, 2, 2, 'FD')
    
    // Mini label
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(100, 116, 139) // slate-500
    doc.text(title.toUpperCase(), x + 4, currentY + 5)
    
    // Aggregates text
    doc.setFontSize(10.5)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(valColorRGB[0], valColorRGB[1], valColorRGB[2])
    doc.text(value, x + 4, currentY + 12)
  }

  drawSummaryCard(marginX, t('allowance') || 'Allowance', formatRupiah(currentIncome), [16, 185, 129]) // green
  drawSummaryCard(77, t('expenses') || 'Expenses', formatRupiah(currentExpenses), [244, 63, 94]) // rose
  drawSummaryCard(139, t('balance') || 'Balance', formatRupiah(currentBalance), [139, 92, 246]) // purple

  // C. FINANCIAL INSIGHTS PANEL BLOCK
  console.log('PDF EXPORT ENGINE: Rendering insights panel card...');
  currentY += 24
  doc.setFillColor(248, 250, 252) // slate-50
  doc.setDrawColor(226, 232, 240) // slate-200
  doc.setLineWidth(0.3)
  doc.roundedRect(marginX, currentY, 180, 26, 2, 2, 'FD')
  
  // Glowing bullet tag
  doc.setFillColor(139, 92, 246)
  doc.rect(marginX + 4, currentY + 3.5, 1.5, 3.5, 'F')

  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(139, 92, 246)
  doc.text((t('financial_insights') || 'FINANCIAL INSIGHTS & METRICS').toUpperCase(), marginX + 7, currentY + 6.5)
  
  // Left column metrics
  doc.setFontSize(7.5)
  doc.setTextColor(71, 85, 105)
  doc.setFont('helvetica', 'bold')
  doc.text(`${(t('largest_spending_cat') || 'Largest Spending Category')}:`, marginX + 6, currentY + 13)
  doc.text(`${(t('avg_daily_spending') || 'Average Daily Spending')}:`, marginX + 6, currentY + 19)
  
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(15, 23, 42)
  doc.text(largestCategory, marginX + 56, currentY + 13)
  doc.text(formatRupiah(averageDaily), marginX + 56, currentY + 19)
  
  // Right column metrics
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(71, 85, 105)
  doc.text(`${(t('expense_trend') || 'Monthly Spending Trend')}:`, marginX + 96, currentY + 13)
  doc.text(`${(t('budget_limit_status') || 'Budget Limit Status')}:`, marginX + 96, currentY + 19)
  
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(15, 23, 42)
  doc.text(trendLabel, marginX + 144, currentY + 13)
  doc.text(budgetStatusText, marginX + 144, currentY + 19)

  // D. CATEGORY BREAKDOWN TABLE
  console.log('PDF EXPORT ENGINE: Initializing Category Breakdown autoTable render...');
  const breakdownRows = breakdown.map(item => {
    const percentage = currentExpenses > 0 ? ((item.value / currentExpenses) * 100).toFixed(1) : '0'
    return [
      t(item.name) || item.name,
      formatRupiah(item.value),
      `${percentage}%`
    ]
  })

  currentY += 32
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text(t('category_dist') || 'Expenses Category Breakdown', marginX, currentY)

  // DIRECT ESM FUNCTION INVOCATION - Prevents runtime Prototype errors!
  autoTable(doc, {
    startY: currentY + 4,
    head: [[
      t('category') || 'Category',
      t('amount') || 'Amount',
      'Ratio (%)'
    ]],
    body: breakdownRows,
    margin: { left: marginX, right: marginX },
    theme: 'striped',
    headStyles: {
      fillColor: [139, 92, 246], // purple
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [71, 85, 105]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    }
  })
  console.log('PDF EXPORT ENGINE: Category Breakdown autoTable rendered successfully.');

  // E. DETAILED TRANSACTION LEDGER
  console.log('PDF EXPORT ENGINE: Initializing Ledger transaction autoTable render...');
  currentY = doc.lastAutoTable.finalY + 10
  
  // Shift to page 2 if space is low to prevent page overflow layout collision
  if (currentY > 235) {
    doc.addPage()
    currentY = 20
  }

  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text(t('ledger_log') || 'Financial Ledger Table', marginX, currentY)

  // Filter transactions matched with UI's active state
  const ledgerRows = transactions.map(tx => {
    const isExpense = tx.type === 'expense'
    const sign = isExpense ? '-' : '+'
    return [
      formatDate(tx.date),
      tx.description || '',
      tx.categories?.name ? t(tx.categories.name) : t('uncategorized'),
      tx.type === 'expense' ? (t('type_expense') || 'Expense') : (t('type_income') || 'Allowance'),
      `${sign}${formatRupiah(tx.amount)}`
    ]
  })

  // DIRECT ESM FUNCTION INVOCATION - Prevents runtime Prototype errors!
  autoTable(doc, {
    startY: currentY + 4,
    head: [[
      t('date') || 'Date',
      t('description') || 'Description',
      t('category') || 'Category',
      t('type') || 'Type',
      t('amount') || 'Amount'
    ]],
    body: ledgerRows,
    margin: { left: marginX, right: marginX, bottom: 20 },
    theme: 'striped',
    headStyles: {
      fillColor: [79, 70, 229], // Indigo
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [71, 85, 105]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: {
      1: { cellWidth: 50 }, // max description width wrapping boundary
      4: { halign: 'right' }
    },
    didParseCell: (data) => {
      // Highlight spent values in Rose and earnings in Emerald for high visual readability!
      if (data.column.index === 4 && data.cell.section === 'body') {
        const val = data.cell.text[0]
        if (val && val.startsWith('-')) {
          data.cell.styles.textColor = [244, 63, 94] // rose
        } else if (val && val.startsWith('+')) {
          data.cell.styles.textColor = [16, 185, 129] // green
        }
      }
    }
  })
  console.log('PDF EXPORT ENGINE: Ledger transaction autoTable rendered successfully.');

  // F. DYNAMIC FOOTER PAGINATION LOOP
  console.log('PDF EXPORT ENGINE: Adding dynamic paginated footer tags...');
  const totalPages = doc.internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(148, 163, 184) // slate-400
    
    // Draw footer line
    doc.setDrawColor(241, 245, 249)
    doc.setLineWidth(0.3)
    doc.line(marginX, 278, 195, 278)

    doc.text(`Kos Wallet © 2026 | ${t('footer_sub') || 'Anak Kos Monthly Financial Report'}`, marginX, 283)
    doc.text(`${t('page') || 'Page'} ${i} ${t('of') || 'of'} ${totalPages}`, 195, 283, { align: 'right' })
  }

  // Trigger file download in browser
  console.log('PDF EXPORT ENGINE: Saving document and triggering file download...');
  const fileMonthStr = monthFilter ? `_${monthFilter}` : '_All'
  doc.save(`Kos_Wallet_Report${fileMonthStr}.pdf`)
  console.log('PDF EXPORT ENGINE: Document saved successfully! Download triggered.');
}
