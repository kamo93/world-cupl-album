import { FromSchema } from 'json-schema-to-ts'
import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts'
import { FastifySchema } from 'fastify'

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
      console.time('supabase user')
      const { data, error } = await fastify
        .supabase()
        .from('users')
        .upsert(request.body)
        .select('avatar, email')
      console.timeEnd('supabase user')
      if (data?.length === 0) {
        await reply.code(404).send({ message: `No user could add with ${request.body.email}.` })
      }
      if (error !== null) {
        fastify.log.info(error)
        await reply.code(500).send({ message: error.hint })
      }
      if (data !== null) {
        console.log('data /user', data)
        console.dir(data[0], { depth: 2 })
        return { data: data[0] }
      }
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
        .select('email, albums(*)')
        .in('email', [userEmail])

      if (data?.length === 0) {
        await res.code(404).send({ message: `Not users with the next email ${userEmail}` })
      }
      if (error !== null) {
        await res.code(500).send({ message: error.hint })
      }
      if (data !== null) {
        return { data: data[0] }
      }
    }
  )

  const paramsGetUsersXAlbumId = {
    type: 'object',
    properties: {
      albumId: {
        type: 'string'
      }
    },
    required: ['albumId']
  } as const
  const schemaGetUsersXAlbumId: FastifySchema = { params: paramsGetUsersXAlbumId }
  fastify.get<{ Params: FromSchema<typeof paramsGetUsersXAlbumId> }>(
    '/users/album/:albumId',
    { schema: schemaGetUsersXAlbumId },
    async (req, res) => {
      const { albumId } = req.params
      const { data, error } = await fastify
        .supabase()
        .from('users')
        .select('email, album_members!inner(album_id)')
        .in('album_members.album_id', [albumId])

      if (data?.length === 0) {
        await res.code(404)
      }
      if (error !== null) {
        await res.code(500).send({ message: error.hint })
      }
      if (data !== null) {
        return { data: data.map(({ email }) => email) }
      }
    }
  )
}

export default users
