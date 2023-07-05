import { SupabaseProvider } from './Contexts/SupabaseContext'
import { BrowserRouter } from 'react-router-dom'
import Router from './Router'
import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'

function App (): JSX.Element {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <ToastContainer
          theme='dark'
        />
        <SupabaseProvider>
          <Router />
        </SupabaseProvider>
      </BrowserRouter>
    </React.StrictMode>
  )
}

export default App
