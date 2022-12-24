import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts'
import { FromSchema } from 'json-schema-to-ts'

const album: FastifyPluginAsyncJsonSchemaToTs = async (fastify, opts): Promise<void> => {
  const queryParamsAlbumSchema = {
    type: 'object',
    properties: {
      albumId: {
        type: 'string'
      }
    },
    additionalProperties: false,
    required: ['albumId']
  } as const
  const queryParams = { querystring: queryParamsAlbumSchema }
  fastify.get<{ Querystring: FromSchema<typeof queryParamsAlbumSchema> }>(
    '/album',
    { schema: queryParams },
    async (req, rep) => {
      const { albumId } = req.query
      const { error, data } = await fastify.supabase()
        .from('albums')
        .select('id, stickers')
        .in('id', [albumId])
      if (data?.length === 0) {
        return await rep.code(400)
      }
      return { data, error }
    }
  )
}

export default album
