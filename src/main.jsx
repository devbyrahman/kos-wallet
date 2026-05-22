import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './hooks/useAuth'
import { TransactionsProvider } from './hooks/useTransactions'
import { LanguageProvider } from './hooks/useLanguage'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <TransactionsProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </TransactionsProvider>
    </AuthProvider>
  </StrictMode>,
)
