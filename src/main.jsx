import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './hooks/useAuth'
import { CategoriesProvider } from './hooks/useCategories'
import { TransactionsProvider } from './hooks/useTransactions'
import { LanguageProvider } from './hooks/useLanguage'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CategoriesProvider>
        <TransactionsProvider>
          <LanguageProvider>
            <App />
          </LanguageProvider>
        </TransactionsProvider>
      </CategoriesProvider>
    </AuthProvider>
  </StrictMode>,
)

