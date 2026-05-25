import React, { createContext, useContext, useState, useEffect } from 'react'

/**
 * MULTI-LANGUAGE TRANSLATION DICTIONARY
 * 
 * Provides localized text objects for Bahasa Indonesia and English.
 * Grouped semantically to ensure long-term maintainability.
 */
const translations = {
  id: {
    // === COMMON / BRAND ===
    kos_wallet: "Kos Wallet",
    student: "Anak Kos",
    sign_out: "KELUAR",
    btn_cancel: "BATAL",
    btn_confirm: "KONFIRMASI",
    btn_delete: "HAPUS",
    processing: "Memproses...",
    uncategorized: "Tanpa Kategori",
    welcome_greeting: "Hai, {name}! 👋",
    hi_user: "Hai, {name}!",

    // === NAVIGATION ===
    dashboard: "Dasbor",
    transactions: "Transaksi",
    analytics: "Analisis",
    budget: "Anggaran",
    settings: "Pengaturan",
    recent_transactions: "Transaksi Terbaru",
    view_all: "Lihat Semua",
    view_analytics: "LIHAT GRAFIK DETAIL",

    // === LEDGER / TRANSACTION LIST ===
    ledger_log: "Catatan Kas Keuangan",
    ledger_log_desc: "Tambah, hapus, cari, dan filter catatan kas keuangan Anda secara dinamis.",
    filter_month: "Semua Bulan",
    filter_category: "Semua Kategori",
    filter_transactions: "Filter Transaksi",
    reset_filters: "Reset Filter",
    select_month: "Pilih Bulan",
    select_category_filter: "Pilih Kategori",
    syncing_ledger: "Sinkronisasi catatan...",
    no_transactions_found: "Transaksi tidak ditemukan",
    no_transactions_found_desc: "Kami tidak menemukan catatan keuangan untuk bulan atau kategori yang dipilih. Silakan ubah filter Anda!",
    delete_record_confirm: "Hapus catatan ini?",
    confirm_delete: "Apakah Anda yakin ingin menghapus transaksi ini?",

    // === TRANSACTION FORM ===
    new_transaction: "Transaksi Baru",
    amount: "Jumlah (Rp)",
    type: "Tipe",
    category: "Kategori",
    date: "Tanggal",
    description: "Deskripsi",
    description_ph: "misal: Indomie, nasi padang, laundry",
    search_ph: "Cari deskripsi, catatan...",
    notes: "Catatan Tambahan (Opsional)",
    notes_ph: "misal: detail pengeluaran",
    btn_save: "SIMPAN TRANSAKSI",
    btn_saving: "MENYIMPAN...",
    select_category: "Pilih kategori...",
    type_all: "Semua Tipe",
    type_income: "Pemasukan (In)",
    type_expense: "Pengeluaran (Out)",
    recurring_label: "Apakah ini transaksi bulanan berulang?",
    income_desc_ph: "misal: Kiriman orang tua, gaji magang",

    // === ANALYTICS / CHARTS ===
    financial_analytics: "Analisis Keuangan",
    analytics_desc: "Visualisasikan rasio kategori pengeluaran dan tren pengeluaran harian secara kronologis.",
    daily_spending: "Tren Pengeluaran Harian",
    daily_spending_sub: "Pengeluaran harian berdasarkan waktu",
    daily_expense: "Pengeluaran Harian",
    category_dist: "Distribusi Kategori",
    category_dist_sub: "Rasio biaya berdasarkan kategori bulan ini",
    no_expense_chart: "Belum ada pengeluaran untuk dianalisis.",
    no_categories_chart: "Belum ada kategori yang terisi.",
    ratio: "Rasio (%)",

    // === BUDGETING ===
    budget_desc: "Atur batas pengeluaran untuk setiap kategori agar tidak melebihi uang saku bulanan Anda.",
    set_limit_amount: "Atur Batas Anggaran (Rp)",
    usage_percentage: "Penggunaan",
    exceeded_budget_by: "Peringatan: Anggaran melebihi batas sebesar {diff}!",
    spent_of_limit: "Terpakai {spent} dari {limit}",
    budget_period: "Bulan",
    ai_recommendation: "Rekomendasi AI",
    ai_smart_insights: "💡 Analisis Anggaran Pintar",
    ai_insight_content: "“Kamu membelanjakan {spent} untuk Makanan bulan ini. Cobalah membatasi nongkrong di kafe di akhir pekan untuk berhemat lebih banyak!”",
    ai_insight_target: "Target Penghematan",
    ai_insight_powered: "Didukung oleh Modul Future Smart AI Finance Advisory Engine.",
    status_safe: "Aman",
    status_no_limit: "Batas Belum Diatur",
    status_over_limit: "Over Limit",
    status_warning: "Peringatan",

    // === HUMOROUS WALLET STATUS ===
    wallet_condition: "Kondisi Dompet",
    consumption: "Konsumsi Anggaran",
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

    // === CATEGORY MANAGER MODAL ===
    manage_categories: "Kelola Kategori",
    add_category: "Tambah Kategori",
    delete_category: "Hapus Kategori",
    category_name: "Nama Kategori",
    category_name_ph: "misal: Belanja, Kosmetik",
    category_type: "Tipe Kategori",
    icon: "Ikon",
    color: "Warna",
    err_delete_category: "Gagal menghapus kategori: {error}",
    category_added_success: "Kategori berhasil ditambahkan!",
    duplicate_category_err: "Nama kategori sudah ada!",
    empty_category_err: "Nama kategori tidak boleh kosong!",
    max_char_err: "Maksimal 20 karakter!",
    delete_warning_title: "Hapus Kategori?",
    delete_warning_desc: "Kategori ini masih digunakan oleh {count} transaksi. Jika dihapus, transaksi-transaksi tersebut akan dikelompokkan ke dalam 'Tanpa Kategori'. Apakah Anda yakin?",
    default_cat_delete_err: "Kategori default sistem tidak dapat dihapus!",
    delete_category_confirm: "Apakah Anda yakin ingin menghapus kategori \"{name}\"? Tindakan ini tidak dapat dibatalkan.",
    category_list_expense: "Daftar Kategori Pengeluaran",
    category_list_income: "Daftar Kategori Pemasukan",
    no_categories_tab: "Tidak ada kategori untuk tab ini.",

    // === SETTINGS PAGE ===
    application_settings: "Pengaturan Aplikasi",
    settings_desc: "Sesuaikan detail profil anak kos Anda dan preferensi aplikasi.",
    student_profile: "Profil Mahasiswa",
    profile_updated: "Profil berhasil diperbarui!",
    profile_update_failed: "Gagal memperbarui profil: {error}",
    read_only: "Hanya Baca",
    save_changes: "SIMPAN PERUBAHAN",
    general_preferences: "Pengaturan Umum",
    app_language: "Bahasa Aplikasi",
    app_language_desc: "Ganti bahasa kamus terjemahan yang aktif.",
    app_theme: "Tema Tampilan",
    app_theme_desc: "Ubah tema antara glassmorphism gelap atau kontras terang.",
    manage_categories_desc: "Tambah, sesuaikan ikon & warna, atau hapus kategori transaksi secara permanen.",
    sign_out_session: "Keluar Akun",
    sign_out_desc: "Keluar dari akun mahasiswa Anda. Semua cache transaksi lokal akan dibersihkan dengan aman.",

    // === PDF EXPORTER ===
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
    footer_sub: "Laporan Keuangan Bulanan Anak Kos",
    period: "Periode",
    page: "Halaman",
    of: "dari",

    // === AUTH GATEWAY ===
    auth_welcome_back_desc: "Selamat datang kembali! Kelola uang sakumu dengan efisien.",
    auth_register_desc: "Bergabunglah dengan anak kos lainnya dan hemat uang!",
    err_fill_all: "Silakan isi semua bidang!",
    err_password_len: "Kata sandi harus minimal 6 karakter!",
    err_full_name: "Silakan masukkan nama lengkap Anda!",
    alert_account_created: "Akun berhasil dibuat! Silakan masuk.",
    full_name: "Nama Lengkap",
    email_address: "Alamat Email",
    password: "Kata Sandi",
    dont_have_account: "Belum punya akun?",
    already_registered: "Sudah terdaftar?",
    sign_up: "Daftar",
    sign_in: "Masuk",

    // === VALIDATION ERRORS & ALERTS ===
    val_amount: "Jumlah harus berupa angka positif lebih dari nol!",
    val_desc: "Silakan masukkan deskripsi.",
    val_category: "Silakan pilih kategori.",
    err_pdf_failed: "Gagal mengekspor laporan PDF: {error}",

    // === CATEGORIES LOOKUPS (CANONICAL MAPS) ===
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
    category_in_use_warning: "Kategori masih digunakan oleh transaksi.",
    establishing_handshake: "Membangun jabat tangan basis data yang aman...",
  },
  en: {
    // === COMMON / BRAND ===
    kos_wallet: "Kos Wallet",
    student: "Student",
    sign_out: "SIGN OUT",
    btn_cancel: "CANCEL",
    btn_confirm: "CONFIRM",
    btn_delete: "DELETE",
    processing: "Processing...",
    uncategorized: "Uncategorized",
    welcome_greeting: "Hi, {name}! 👋",
    hi_user: "Hi, {name}!",

    // === NAVIGATION ===
    dashboard: "Dashboard",
    transactions: "Transactions",
    analytics: "Analytics",
    budget: "Budget",
    settings: "Settings",
    recent_transactions: "Recent Transactions",
    view_all: "View All",
    view_analytics: "VIEW DETAILED CHARTS",

    // === LEDGER / TRANSACTION LIST ===
    ledger_log: "Financial Ledger Log",
    ledger_log_desc: "Add, delete, search, and filter your financial cashflow entries dynamically.",
    filter_month: "All Months",
    filter_category: "All Categories",
    filter_transactions: "Filter Transactions",
    reset_filters: "Reset Filters",
    select_month: "Select Month",
    select_category_filter: "Select Category",
    syncing_ledger: "Syncing with ledger...",
    no_transactions_found: "No transactions found",
    no_transactions_found_desc: "We couldn't find any financial entries for the selected month or category. Try modifying your filters!",
    delete_record_confirm: "Delete this record?",
    confirm_delete: "Are you sure you want to delete this transaction?",

    // === TRANSACTION FORM ===
    new_transaction: "New Transaction",
    amount: "Amount (Rp)",
    type: "Type",
    category: "Category",
    date: "Date",
    description: "Description",
    description_ph: "e.g., Instant noodles, laundry, textbook",
    search_ph: "Search description, notes...",
    notes: "Notes (Optional)",
    notes_ph: "e.g. details of expense",
    btn_save: "SAVE TRANSACTION",
    btn_saving: "SAVING...",
    select_category: "Select category...",
    type_all: "All Types",
    type_income: "Income (In)",
    type_expense: "Expense (Out)",
    recurring_label: "Is this a recurring monthly transaction?",
    income_desc_ph: "e.g. Allowance from Parents, freelance work",

    // === ANALYTICS / CHARTS ===
    financial_analytics: "Financial Analytics",
    analytics_desc: "Visualize your financial cashflow categories ratio and daily money outflows chronologically.",
    daily_spending: "Daily Spending Trend",
    daily_spending_sub: "Daily money outflows chronologically",
    daily_expense: "Daily Expense",
    category_dist: "Category Distribution",
    category_dist_sub: "Categorized cost ratios this month",
    no_expense_chart: "No expenses recorded to analyze.",
    no_categories_chart: "No categories populated yet.",
    ratio: "Ratio (%)",

    // === BUDGETING ===
    budget_desc: "Set spending thresholds for each expense category to stay within your monthly allowance.",
    set_limit_amount: "Set Budget Limit (Rp)",
    usage_percentage: "Usage",
    exceeded_budget_by: "Warning: You have exceeded your budget by {diff}!",
    spent_of_limit: "{spent} spent of {limit}",
    budget_period: "Month",
    ai_recommendation: "AI Recommendation",
    ai_smart_insights: "💡 Smart Budgeting Insights",
    ai_insight_content: "“You spent {spent} on Food this month. Try limiting café visits on weekends to save more!”",
    ai_insight_target: "Saving Target",
    ai_insight_powered: "Powered by Future Smart AI Finance Advisory Engine module.",
    status_safe: "Safe",
    status_no_limit: "No Limit Set",
    status_over_limit: "Over Limit",
    status_warning: "Warning",

    // === HUMOROUS WALLET STATUS ===
    wallet_condition: "Wallet Condition",
    consumption: "Expenses Consumption",
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

    // === CATEGORY MANAGER MODAL ===
    manage_categories: "Manage Categories",
    add_category: "Add Category",
    delete_category: "Delete Category",
    category_name: "Category Name",
    category_name_ph: "e.g. Shopping, Cosmetics",
    category_type: "Category Type",
    icon: "Icon",
    color: "Color",
    err_delete_category: "Failed to delete category: {error}",
    category_added_success: "Category successfully added!",
    duplicate_category_err: "Category name already exists!",
    empty_category_err: "Category name cannot be empty!",
    max_char_err: "Maximum 20 characters!",
    delete_warning_title: "Delete Category?",
    delete_warning_desc: "This category is still used by {count} transactions. If deleted, these transactions will be classified under 'Uncategorized'. Are you sure?",
    default_cat_delete_err: "Cannot delete default system categories!",
    delete_category_confirm: "Are you sure you want to delete category \"{name}\"? This action cannot be undone.",
    category_list_expense: "Expense Categories List",
    category_list_income: "Income Categories List",
    no_categories_tab: "No categories found for this tab.",

    // === SETTINGS PAGE ===
    application_settings: "Application Settings",
    settings_desc: "Customize your boarder profile details and application preferences.",
    student_profile: "Student Profile",
    profile_updated: "Profile updated successfully!",
    profile_update_failed: "Failed to update profile: {error}",
    read_only: "Read-only",
    save_changes: "SAVE CHANGES",
    general_preferences: "Preferences",
    app_language: "Application Language",
    app_language_desc: "Toggle active dictionary translations.",
    app_theme: "Interface Theme",
    app_theme_desc: "Toggle dark glassmorphism mode or light contrast mode.",
    manage_categories_desc: "Add, customize icons & colors, or delete transaction categories permanently.",
    sign_out_session: "Sign Out Session",
    sign_out_desc: "Log out from your student account. All local transaction caches will be cleared safely.",

    // === PDF EXPORTER ===
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
    footer_sub: "Anak Kos Monthly Financial Report",
    period: "Period",
    page: "Page",
    of: "of",

    // === AUTH GATEWAY ===
    auth_welcome_back_desc: "Welcome back! Manage your allowance efficiently.",
    auth_register_desc: "Join your fellow boarders and save money!",
    err_fill_all: "Please fill in all fields!",
    err_password_len: "Password must be at least 6 characters long!",
    err_full_name: "Please tell us your full name!",
    alert_account_created: "Account created! Please log in.",
    full_name: "Full Name",
    email_address: "Email Address",
    password: "Password",
    dont_have_account: "Don't have an account yet?",
    already_registered: "Already registered?",
    sign_up: "Sign Up",
    sign_in: "Sign In",

    // === VALIDATION ERRORS & ALERTS ===
    val_amount: "Amount must be a positive number greater than zero!",
    val_desc: "Please enter a description.",
    val_category: "Please select a category.",
    err_pdf_failed: "Failed to export PDF report: {error}",

    // === CATEGORIES LOOKUPS (CANONICAL MAPS) ===
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
    category_in_use_warning: "Category is currently in use by transactions.",
    establishing_handshake: "Establishing secure database handshake...",
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

  // Translation helper function supporting dynamic parameter interpolation and English fallbacks
  const t = (key, params = {}) => {
    if (!key) return ''
    const dict = translations[language] || {}
    const defaultDict = translations['en'] || {}
    let translation = dict[key] !== undefined ? dict[key] : (defaultDict[key] !== undefined ? defaultDict[key] : key)

    if (params && typeof params === 'object') {
      Object.entries(params).forEach(([k, v]) => {
        translation = translation.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v))
      })
    }
    return translation
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

