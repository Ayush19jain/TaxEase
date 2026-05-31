import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { TaxProvider } from './context/TaxContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <TaxProvider>
        <App />
      </TaxProvider>
    </AuthProvider>
  </StrictMode>,
)
