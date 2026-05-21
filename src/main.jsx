import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './hooks/useAuth'
import { TransactionsProvider } from './hooks/useTransactions'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <TransactionsProvider>
        <App />
      </TransactionsProvider>
    </AuthProvider>
  </StrictMode>,
)
