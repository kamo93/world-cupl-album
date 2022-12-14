import { useContext } from 'react'
import { SupabaseContext } from './Provider'

export const useSupabaseContext = () => {
  const context = useContext(SupabaseContext)

  if (context == null) {
    throw new Error('To use useSupabaseContext your component should be wrap on <SubabaseContext.Provider>')
  }

  return context
}
