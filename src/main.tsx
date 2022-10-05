import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { SupabaseProvider } from './Contexts/SupabaseContext'
import "@fortawesome/fontawesome-free/css/all.min.css"

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <SupabaseProvider>
        <App />
      </SupabaseProvider>
    </BrowserRouter>
  </React.StrictMode>
)
