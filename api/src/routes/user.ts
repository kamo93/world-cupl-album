// import { FastifyPluginAsync } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'
import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts'
// import fetch from 'node-fetch'

const users: FastifyPluginAsyncJsonSchemaToTs = async (fastify, opts): Promise<void> => {
  const bodyUserSchema = {
    type: 'object',
    required: ['email', 'avatar'],
    properties: {
      email: {
        type: 'string'
      },
      avatar: {
        type: 'string'
      }
    }
  } as const
  const userSchema = { body: bodyUserSchema }
  fastify.post<{ Body: FromSchema<typeof bodyUserSchema> }>(
    '/users',
    { schema: userSchema },
    async function (request, reply) {
      const { data, error } = await fastify.supabase().from('users').insert(request.body).select()
      console.log('error', error)
      return { ...data }
    })

  const queryParamsUserSchema = {
    type: 'object',
    properties: {
      userEmail: {
        type: 'string'
      }
    },
    additionalProperties: false,
    required: ['userEmail']
  } as const
  const queryParams = { querystring: queryParamsUserSchema }
  fastify.get<{ Querystring: FromSchema<typeof queryParamsUserSchema> }>(
    '/users',
    { schema: queryParams },
    async (req, rep) => {
      const { userEmail } = req.query
      const { error, data } = await fastify.supabase()
        .from('users')
        .select('email, albums-users (album_id)')
        .in('email', [userEmail])
      if (data?.length === 0) {
        return await rep.code(400)
      }
      return { data, error }
    }
  )
}

export default users
