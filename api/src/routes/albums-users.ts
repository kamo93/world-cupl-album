import { FromSchema } from 'json-schema-to-ts'
import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts'

const users: FastifyPluginAsyncJsonSchemaToTs = async (fastify, opts): Promise<void> => {
  const albumUserBodySchema = {
    type: 'object',
    required: ['email', 'album_id'],
    properties: {
      email: {
        type: 'string'
      },
      album_id: {
        type: 'string'
      }
    }
  } as const
  const userSchema = { body: albumUserBodySchema }
  fastify.post<{ Body: FromSchema<typeof albumUserBodySchema> }>(
    '/album/user',
    { schema: userSchema },
    async function (req, rep) {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { email, album_id } = req.body
      const { error, data } = await fastify.supabase().from('albums-users').insert({ email, album_id }).select()
      return { data, error }
    })
}

export default users
