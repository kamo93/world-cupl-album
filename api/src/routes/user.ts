import { FromSchema } from 'json-schema-to-ts'
import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts'

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
    '/user',
    { schema: userSchema },
    async function (request, reply) {
      const { data, error } = await fastify
        .supabase()
        .from('users')
        .upsert(request.body)
        .select('avatar email')
      if (data?.length === 0) {
        return await reply.code(404).send({ message: `No user could add with ${request.body.email}.` })
      }
      if (error !== null) {
        fastify.log.info(error)
        return await reply.code(500).send({ message: error.hint })
      }
      console.log('data /user', data)
      console.dir(data[0], { depth: 2 })
      return { data: data[0] }
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
    '/user',
    { schema: queryParams },
    async (req, res) => {
      const { userEmail } = req.query
      const { error, data } = await fastify.supabase()
        .from('users')
        .select('email, albums-users (album_id)')
        .in('email', [userEmail])
      if (data?.length === 0) {
        return await res.code(404).send({ message: `Not users with the next email ${userEmail}` })
      }
      if (error !== null) {
        return await res.code(500).send({ message: error.hint })
      }
      return { data: data[0] }
    }
  )
}

export default users
