import { FastifyInstance as FI } from 'fastify'
import { SupabaseClient } from '@supabase/supabase-js'

declare global {
  namespace NODEJS {
    interface ProccessNev {
      PORT?: string
    }
  }
}

declare module 'fastify' {
  interface FastifyInstance extends FI {
    config: {
      SUPABASE_URL: string
      SUPABASE_ANON_KEY: string
    }
    supabase: () => SupabaseClient<any, 'public', any >

  }
}
