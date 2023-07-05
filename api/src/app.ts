import { join, dirname } from 'path'
import { FastifyBaseLogger, FastifyInstance, FastifyPluginAsync, FastifyTypeProviderDefault, RawServerDefault } from 'fastify'
import { createClient } from '@supabase/supabase-js'
import fastifyEnv from '@fastify/env'
import fastifyWS from '@fastify/websocket'
// TODO mail when have this deploy to resend users to that url
// import fastifyMailer from 'fastify-mailer'
import { fileURLToPath } from 'url'
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload'
import { IncomingMessage, ServerResponse } from 'http'

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

const createSupabaseClient = (fastify: FastifyInstance<RawServerDefault, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, FastifyTypeProviderDefault>) => {
  const supabaseUrl = fastify.config.SUPABASE_URL
  const supabaseAnonKey = fastify.config.SUPABASE_ANON_KEY

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storageKey: 'album-auth'
    }
  })

  return supabase
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
    dotenv: true,
    schema: envSchema
  })

  void fastify.register(fastifyWS)

  //   void fastify.register(fastifyMailer, {
  //     defaults: { from: 'kamo.fifa@gmail.com' },
  //     transport: {
  //       host: 'smtp.gmail.com',
  //       port: 465,
  //       secure: true,
  //       auth: {
  //         user: 'kamo.fifa@gmail.com',
  //         pass: 'Fifa123.'
  //       }
  //     }
  //   })

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  // void fastify.register(AutoLoad, {
  //   dir: join(__dirname, 'plugins'),
  //   options: opts
  // })

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: { ...opts, prefix: '/api' }
  }).ready((err: Error | null) => {
    if (err !== null) console.error(err)
    fastify.decorate('supabase', createSupabaseClient(fastify))
  })
}

export default app
export { app, options }
