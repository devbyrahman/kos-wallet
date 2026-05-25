import React, { createContext, useContext, useState, useEffect } from 'react'

/**
 * MULTI-LANGUAGE TRANSLATION DICTIONARY
 * 
 * Provides localized text objects for Bahasa Indonesia and English.
 */
const translations = {
  id: {
    kos_wallet: "Kos Wallet",
    student: "Anak Kos",
    sign_out: "KELUAR",
    dashboard: "Dasbor",
    transactions: "Transaksi",
    analytics: "Analisis",
    budget: "Anggaran",
    settings: "Pengaturan",
    export_pdf: "Ekspor PDF",
    monthly_report_title: "Laporan Keuangan Bulanan",
    generated_on: "Dibuat pada",
    financial_insights: "Analisis & Metrik Keuangan",
    largest_spending_cat: "Kategori Pengeluaran Terbesar",
    avg_daily_spending: "Rata-rata Pengeluaran Harian",
    expense_trend: "Tren Pengeluaran Bulanan",
    budget_limit_status: "Status Batas Anggaran",
    prev_month: "bulan sebelumnya",
    trend_na: "N/A (Bulan Pertama)",
    budget_status_none: "Batas Belum Diatur",
    budget_status_all_safe: "Semua Kategori Aman",
    budget_status_over: "Kategori Over Limit",
    footer_brand: "KOS WALLET © 2026. DIBUAT DENGAN",
    footer_sub: "UNTUK MAHASISWA DI KOS-KOSAN.",
    
    // Overview Cards
    allowance: "Allowance (Uang Saku)",
    allowance_sub: "Total dana terkumpul",
    expenses: "Expenses (Pengeluaran)",
    expenses_sub: "Total uang terbelanjakan",
    balance: "Sisa Saldo",
    balance_sub: "Sisa uang di dompet",
    
    // Wallet Condition
    wallet_condition: "Kondisi Dompet",
    consumption: "Konsumsi Anggaran",
    
    // Humors Statuses keys
    status_no_budget_title: "Belum Ada Anggaran",
    status_no_budget_desc: "Tambahkan uang saku untuk mulai mengatur anggaran!",
    status_aman_jaya_title: "Aman Jaya (Makan Mewah)",
    status_aman_jaya_desc: "Dompetmu sehat walafiat! Pizza atau nongkrong di kafe disetujui.",
    status_siaga_santai_title: "Siaga Santai (Makan Warteg)",
    status_siaga_santai_desc: "Kondisi sedang. Tetap makan warteg dan kurangi belanja impulsif.",
    status_darurat_kost_title: "Darurat Kost (Indomie Saja)",
    status_darurat_kost_desc: "Saldo kritis! Saatnya nyetok mi instan dan jalan kaki ke kampus.",
    status_kanker_title: "Kanker Stadium Akhir (Tanggal Tua)",
    status_kanker_desc: "Kelebihan anggaran! Kamu belanja melebihi pemasukan. Segera hubungi orang tua!",
    
    // Ledger List
    ledger_log: "Catatan Kas Keuangan",
    add_transaction: "TAMBAH TRANSAKSI",
    filter_month: "Semua Bulan",
    filter_category: "Semua Kategori",
    type_all: "Semua Tipe",
    type_income: "Pemasukan (In)",
    type_expense: "Pengeluaran (Out)",
    empty_transactions: "Belum ada catatan transaksi.",
    confirm_delete: "Apakah Anda yakin ingin menghapus transaksi ini?",
    btn_delete: "HAPUS",
    btn_cancel: "BATAL",
    
    // Transaction Form Modal
    new_transaction: "Transaksi Baru",
    amount: "Jumlah (Rp)",
    type: "Tipe",
    category: "Kategori",
    date: "Tanggal",
    description: "Deskripsi",
    description_ph: "misal: Indomie, nasi padang, laundry",
    notes: "Catatan Tambahan (Opsional)",
    notes_ph: "misal: detail pengeluaran",
    btn_save: "SIMPAN TRANSAKSI",
    btn_saving: "MENYIMPAN...",
    select_category: "Pilih kategori...",
    
    // Charts
    daily_spending: "Tren Pengeluaran Harian",
    category_dist: "Distribusi Kategori",
    no_expense_chart: "Belum ada pengeluaran untuk dianalisis.",
    
    // Categories Lookups
    "Monthly Allowance": "Uang Saku Bulanan",
    "Other Income": "Pemasukan Lainnya",
    "Food": "Makanan",
    "Transportation": "Transportasi",
    "College Needs": "Pendidikan",
    "Internet": "Internet",
    "Entertainment": "Hiburan",
    "Emergency": "Darurat",
    "Others": "Lainnya",
    "Salary": "Gaji / Uang Saku",
    "Freelance": "Pekerjaan Sampingan",
    "Transport": "Transportasi",
    "Education": "Pendidikan",
    "Unknown Category": "Kategori Tidak Dikenal",
    "Kategori Lama": "Kategori Lama",
    "category_in_use_warning": "Kategori masih digunakan oleh transaksi.",
    "manage_categories": "Kelola Kategori",
    "add_category": "Tambah Kategori",
    "delete_category": "Hapus Kategori",
    "category_name": "Nama Kategori",
    "category_type": "Tipe Kategori",
    "icon": "Ikon",
    "color": "Warna",
    "duplicate_category_err": "Nama kategori sudah ada!",
    "empty_category_err": "Nama kategori tidak boleh kosong!",
    "max_char_err": "Maksimal 20 karakter!",
    "delete_warning_title": "Hapus Kategori?",
    "delete_warning_desc": "Kategori ini masih digunakan oleh {count} transaksi. Jika dihapus, transaksi-transaksi tersebut akan dikelompokkan ke dalam 'Tanpa Kategori'. Apakah Anda yakin?",
    
    // Splash Handshake
    establishing_handshake: "Membangun jabat tangan basis data yang aman...",

    // Filters & Table Log Addition
    filter_transactions: "Filter Transaksi",
    reset_filters: "Reset Filter",
    select_month: "Pilih Bulan",
    select_category_filter: "Pilih Kategori",
    syncing_ledger: "Sinkronisasi catatan...",
    no_transactions_found: "Transaksi tidak ditemukan",
    no_transactions_found_desc: "Kami tidak menemukan catatan keuangan untuk bulan atau kategori yang dipilih. Silakan ubah filter Anda!",
    delete_record_confirm: "Hapus catatan ini?",
    btn_confirm: "KONFIRMASI",
    uncategorized: "Tanpa Kategori",

    // Wallet Stats Addition
    daily_spending_sub: "Pengeluaran harian berdasarkan waktu",
    daily_expense: "Pengeluaran Harian",
    category_dist_sub: "Rasio biaya berdasarkan kategori bulan ini",
    no_categories_chart: "Belum ada kategori yang terisi.",

    // Auth Gateway
    auth_welcome_back_desc: "Selamat datang kembali! Kelola uang sakumu dengan efisien.",
    auth_register_desc: "Bergabunglah dengan anak kos lainnya dan hemat uang!",
    err_fill_all: "Silakan isi semua bidang!",
    err_password_len: "Kata sandi harus minimal 6 karakter!",
    err_full_name: "Silakan masukkan nama lengkap Anda!",
    alert_account_created: "Akun berhasil dibuat! Silakan masuk.",
    full_name: "Nama Lengkap",
    email_address: "Alamat Email",
    password: "Kata Sandi",
    processing: "Memproses...",
    btn_sign_in: "MASUK",
    btn_create_account: "BUAT AKUN",
    dont_have_account: "Belum punya akun?",
    already_registered: "Sudah terdaftar?",
    sign_up: "Daftar",
    sign_in: "Masuk",
    val_amount: "Jumlah harus berupa angka positif lebih dari nol!",
    val_desc: "Silakan masukkan deskripsi.",
    val_category: "Silakan pilih kategori.",
    recurring_label: "Apakah ini transaksi bulanan berulang?",
  },
  en: {
    kos_wallet: "Kos Wallet",
    student: "Student",
    sign_out: "SIGN OUT",
    dashboard: "Dashboard",
    transactions: "Transactions",
    analytics: "Analytics",
    budget: "Budget",
    settings: "Settings",
    export_pdf: "Export PDF",
    monthly_report_title: "Monthly Financial Report",
    generated_on: "Generated on",
    financial_insights: "Financial Insights & Metrics",
    largest_spending_cat: "Largest Spending Category",
    avg_daily_spending: "Average Daily Spending",
    expense_trend: "Monthly Spending Trend",
    budget_limit_status: "Budget Limit Status",
    prev_month: "previous month",
    trend_na: "N/A (First Month)",
    budget_status_none: "No Limits Set",
    budget_status_all_safe: "All Categories Safe",
    budget_status_over: "Categories Over Limit",
    footer_brand: "KOS WALLET © 2026. CREATED WITH",
    footer_sub: "FOR CAMPUS STUDENTS LIVING IN BOARDING HOUSES.",
    
    // Overview Cards
    allowance: "Allowance (In)",
    allowance_sub: "Total funds collected",
    expenses: "Expenses (Out)",
    expenses_sub: "Total money spent",
    balance: "Remaining Balance",
    balance_sub: "Available money on hand",
    
    // Wallet Condition
    wallet_condition: "Wallet Condition",
    consumption: "Expenses Consumption",
    
    // Humors Statuses keys
    status_no_budget_title: "No Budget Set",
    status_no_budget_desc: "Add your allowance to start budgeting!",
    status_aman_jaya_title: "Aman Jaya (Fine Dining)",
    status_aman_jaya_desc: "Your wallet is healthy! Pizza or cafe sessions are approved.",
    status_siaga_santai_title: "Siaga Santai (Local Diner)",
    status_siaga_santai_desc: "Moderate health. Stick to local foods and hold back on impulse purchases.",
    status_darurat_kost_title: "Darurat Kost (Instant Noodles)",
    status_darurat_kost_desc: "Critical balance! Time to stock up on instant noodles and walk to campus.",
    status_kanker_title: "Late Stage Empty Wallet (Late Month)",
    status_kanker_desc: "Overbudget! You have spent more than you earned. Alert your parents immediately!",
    
    // Ledger List
    ledger_log: "Financial Ledger Log",
    add_transaction: "ADD TRANSACTION",
    filter_month: "All Months",
    filter_category: "All Categories",
    type_all: "All Types",
    type_income: "Income (In)",
    type_expense: "Expense (Out)",
    empty_transactions: "No transactions recorded yet.",
    confirm_delete: "Are you sure you want to delete this transaction?",
    btn_delete: "DELETE",
    btn_cancel: "CANCEL",
    
    // Transaction Form Modal
    new_transaction: "New Transaction",
    amount: "Amount (Rp)",
    type: "Type",
    category: "Category",
    date: "Date",
    description: "Description",
    description_ph: "e.g., Instant noodles, laundry, textbook",
    notes: "Notes (Optional)",
    notes_ph: "e.g., details of expense",
    btn_save: "SAVE TRANSACTION",
    btn_saving: "SAVING...",
    select_category: "Select category...",
    
    // Charts
    daily_spending: "Daily Spending Trend",
    category_dist: "Category Distribution",
    no_expense_chart: "No expenses recorded to analyze.",
    
    // Categories Lookups
    "Monthly Allowance": "Monthly Allowance",
    "Other Income": "Other Income",
    "Food": "Food",
    "Transportation": "Transportation",
    "College Needs": "College Needs",
    "Internet": "Internet",
    "Entertainment": "Entertainment",
    "Emergency": "Emergency",
    "Others": "Others",
    "Salary": "Salary / Allowance",
    "Freelance": "Freelance",
    "Transport": "Transport",
    "Education": "Education",
    "Unknown Category": "Unknown Category",
    "Kategori Lama": "Legacy Category",
    "category_in_use_warning": "Category is currently in use by transactions.",
    "manage_categories": "Manage Categories",
    "add_category": "Add Category",
    "delete_category": "Delete Category",
    "category_name": "Category Name",
    "category_type": "Category Type",
    "icon": "Icon",
    "color": "Color",
    "duplicate_category_err": "Category name already exists!",
    "empty_category_err": "Category name cannot be empty!",
    "max_char_err": "Maximum 20 characters!",
    "delete_warning_title": "Delete Category?",
    "delete_warning_desc": "This category is still used by {count} transactions. If deleted, these transactions will be classified under 'Uncategorized'. Are you sure?",
    
    // Splash Handshake
    establishing_handshake: "Establishing secure database handshake...",

    // Filters & Table Log Addition
    filter_transactions: "Filter Transactions",
    reset_filters: "Reset Filters",
    select_month: "Select Month",
    select_category_filter: "Select Category",
    syncing_ledger: "Syncing with ledger...",
    no_transactions_found: "No transactions found",
    no_transactions_found_desc: "We couldn't find any financial entries for the selected month or category. Try modifying your filters!",
    delete_record_confirm: "Delete this record?",
    btn_confirm: "CONFIRM",
    uncategorized: "Uncategorized",

    // Wallet Stats Addition
    daily_spending_sub: "Daily money outflows chronologically",
    daily_expense: "Daily Expense",
    category_dist_sub: "Categorized cost ratios this month",
    no_categories_chart: "No categories populated yet.",

    // Auth Gateway
    auth_welcome_back_desc: "Welcome back! Manage your allowance efficiently.",
    auth_register_desc: "Join your fellow boarders and save money!",
    err_fill_all: "Please fill in all fields!",
    err_password_len: "Password must be at least 6 characters long!",
    err_full_name: "Please tell us your full name!",
    alert_account_created: "Account created! Please log in.",
    full_name: "Full Name",
    email_address: "Email Address",
    password: "Password",
    processing: "Processing...",
    btn_sign_in: "SIGN IN",
    btn_create_account: "CREATE ACCOUNT",
    dont_have_account: "Don't have an account yet?",
    already_registered: "Already registered?",
    sign_up: "Sign Up",
    sign_in: "Sign In",
    val_amount: "Amount must be a positive number greater than zero!",
    val_desc: "Please enter a description.",
    val_category: "Please select a category.",
    recurring_label: "Is this a recurring monthly transaction?",
  }
}

const LanguageContext = createContext(null)

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    const savedLanguage = localStorage.getItem('kos_wallet_lang')
    if (savedLanguage === 'en' || savedLanguage === 'id') {
      return savedLanguage
    }
    return 'id' // Default language is Bahasa Indonesia
  })

  const setLanguage = (lang) => {
    if (lang === 'en' || lang === 'id') {
      setLanguageState(lang)
      localStorage.setItem('kos_wallet_lang', lang)
    }
  }

  // Translation helper function
  const t = (key) => {
    if (!key) return ''
    const dict = translations[language] || translations['id']
    return dict[key] || key
  }

  const value = {
    language,
    setLanguage,
    t,
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used inside a LanguageProvider! Make sure to wrap your main layout.')
  }
  return context
}
