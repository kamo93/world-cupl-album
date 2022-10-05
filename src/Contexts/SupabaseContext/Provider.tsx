import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createContext } from 'react'

export const SupabaseContext = createContext<{ supabase: SupabaseClient<any, 'public', any > }| null>(null);

const supabaseUrl = import.meta.env.VITE_REACT_APP_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storageKey: 'album-auth'
  }
});

export const SupabaseProvider = ({children}: {children: React.ReactNode}) => {
  return (
    <SupabaseContext.Provider value={{supabase}}>{children}</SupabaseContext.Provider>
  )
}
