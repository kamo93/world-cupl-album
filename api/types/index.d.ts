import { FastifyInstance as FI } from 'fastify'
import { SupabaseClient } from '@supabase/supabase-js'
import { Transporter } from 'nodemailer'
import { Database } from './database.types'

export interface FastifyMailerNamedInstance {
  [namespace: string]: Transporter
}
export type FastifyMailer = FastifyMailerNamedInstance & Transporter

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
    supabase: SupabaseClient<Database, 'public'>
    mailer: FastifyMailer
  }
}
