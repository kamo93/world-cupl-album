import { join, resolve, dirname } from 'path'
import { FastifyPluginAsync } from 'fastify'
import { createClient } from '@supabase/supabase-js'
import fastifyEnv from '@fastify/env'
import { fileURLToPath } from 'url'
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload'

// eslint-disable-next-line @typescript-eslint/naming-convention
const __filename = fileURLToPath(import.meta.url)
// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = dirname(__filename)

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {
}

const envSchema = {
  type: 'object',
  required: ['SUPABASE_URL', 'SUPABASE_ANON_KEY'],
  properties: {
    SUPABASE_URL: {
      type: 'string',
      default: 'default'
    },
    SUPABASE_ANON_KEY: {
      type: 'string',
      default: 'default'
    }
  }
}

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // Place here your custom code!
  void fastify.register(fastifyEnv, {
    dotenv: {
      path: `${resolve(__dirname, '../../.env.local')}` // env files are for the whole project
    },
    schema: envSchema
  })

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  // void fastify.register(AutoLoad, {
  //   dir: join(__dirname, 'plugins'),
  //   options: opts
  // })

  fastify.decorate('supabase', () => {
    const supabaseUrl = fastify.config.SUPABASE_URL
    const supabaseAnonKey = fastify.config.SUPABASE_ANON_KEY

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storageKey: 'album-auth'
      }
    })

    return supabase
  })
  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: { ...opts, prefix: '/api' }
  })
}

export default app
export { app, options }
