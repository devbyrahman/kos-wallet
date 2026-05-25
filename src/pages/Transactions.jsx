import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import TransactionList from '../components/TransactionList'
import TransactionForm from '../components/TransactionForm'

export default function Transactions() {
  const { t } = useLanguage()
  const [isFormOpen, setIsFormOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4 sm:gap-6 text-left">
      
      {/* HEADER CONTROLS BAR */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 bg-app-card-bg/40 backdrop-blur-xl border border-app-border p-4 sm:p-5 rounded-2xl">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-app-text-primary">
            {t('ledger_log') || 'Financial Ledger Log'}
          </h2>
          <p className="text-xs text-app-text-secondary mt-0.5">
            {t('ledger_log_desc')}
          </p>
        </div>

        {/* Add Transaction CTA Button */}
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center justify-center gap-1.5 py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs tracking-wider rounded-xl transition-all shadow-lg shadow-purple-600/10 active:translate-y-0.5 hover:cursor-pointer w-full xs:w-auto shrink-0"
        >
          <Plus size={16} />
          <span>{t('add_transaction') || 'ADD TRANSACTION'}</span>
        </button>
      </div>

      {/* FULL LEDGER TABLE LIST */}
      <section className="w-full">
        <TransactionList />
      </section>

      {/* ADD TRANSACTION FORM MODAL CONTAINER */}
      <TransactionForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />

    </div>
  )
}
