import React, { useState, useEffect } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import WalletStats from '../components/WalletStats'

export default function Analytics() {
  const { t, language } = useLanguage()

  // Reactive theme observer to trigger flawless Recharts SVG redraws on theme toggle
  const [theme, setTheme] = useState(() => 
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  )

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark')
      setTheme(isDark ? 'dark' : 'light')
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="flex flex-col gap-4 sm:gap-6 text-left">
      
      {/* HEADER SECTION */}
      <div className="bg-app-card-bg/40 backdrop-blur-xl border border-app-border p-4 sm:p-5 rounded-2xl">
        <h2 className="text-base sm:text-lg font-bold text-app-text-primary">
          {t('financial_analytics')}
        </h2>
        <p className="text-xs text-app-text-secondary mt-0.5">
          {t('analytics_desc')}
        </p>
      </div>

      {/* RENDER DYNAMIC CHARTS */}
      <section className="w-full overflow-hidden">
        <WalletStats key={`${theme}-${language}`} />
      </section>

    </div>
  )
}
