import { SupabaseProvider } from './Contexts/SupabaseContext'
import { BrowserRouter } from 'react-router-dom'
import Router from './Router'
import React from 'react'

function App (): JSX.Element {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <SupabaseProvider>
          <Router />
        </SupabaseProvider>
      </BrowserRouter>
    </React.StrictMode>
  )
}

export default App
