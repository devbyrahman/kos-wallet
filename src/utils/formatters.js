/**
 * FORMATTER UTILITIES
 * 
 * Rationale:
 * Keeping formatting logic out of React components follows the "Don't Repeat Yourself" (DRY) principle.
 * If we want to change how currency or dates look, we only have to edit this single file,
 * rather than scanning dozens of components!
 */

/**
 * Format a number as Indonesian Rupiah (Rp)
 * Example: 1500000 -> "Rp 1.500.000"
 * 
 * @param {number|string} amount 
 * @returns {string} Formatted Rupiah string
 */
export const formatRupiah = (amount) => {
  const num = Number(amount)
  if (isNaN(num)) return 'Rp 0'
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

/**
 * Format a database date string into a friendly readable format
 * Example: "2026-05-21" -> "21 May 2026"
 * 
 * @param {string} dateString 
 * @returns {string} Readably formatted date
 */
export const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

/**
 * Get the 'YYYY-MM' key from a date string or Date object
 * Rationale: This key matches our database 'month_key' columns, allowing us to perform fast,
 * optimized monthly queries without parsing dates at runtime on PostgreSQL.
 * 
 * Example: "2026-05-21" -> "2026-05"
 * 
 * @param {Date|string} inputDate 
 * @returns {string} Month key (YYYY-MM)
 */
export const getMonthKey = (inputDate = new Date()) => {
  const d = new Date(inputDate)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0') // months are 0-indexed in JS!
  return `${year}-${month}`
}
