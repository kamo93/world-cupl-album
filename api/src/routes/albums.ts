import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts'
import { FastifySchema } from 'fastify'
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
  const params: FastifySchema = { params: queryParamsAlbumSchema }
  fastify.get<{ Params: FromSchema<typeof queryParamsAlbumSchema> }>(
    '/albums/:albumId',
    { schema: params },
    async (req, res) => {
      const { albumId } = req.params
      const { error, data } = await fastify.supabase()
        .from('albums')
        .select('id, stickers')
        .in('id', [albumId])
      if (data?.length === 0) {
        return await res.code(404).send({ message: `The album ${albumId} doesn't found.` })
      }
      if (error !== null) {
        return await res.code(500).send({ message: error.hint })
      }
      fastify.log.info(data)
      return { data: data[0] }
    }
  )

  fastify.get(
    '/albums',
    async (req, rep) => {
      const { error, data } = await fastify
        .supabase()
        .from('albums')
        .select('id, name')
      if (data?.length === 0) {
        return await rep.code(400)
      }
      if (error !== null) {
        return await rep.code(500).send({ message: error.hint })
      }
      return { data }
    }
  )

  const bodyAlbumSchema = {
    type: 'object',
    required: ['stickers', 'name'],
    properties: {
      stickers: {
        type: 'object',
        properties: {
          figures: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                value: {
                  type: 'string'
                },
                repeat: {
                  type: 'string'
                }
              }
            }
          }
        }
      },
      name: {
        type: 'string'
      }
    }
  } as const
  fastify.post<{ Body: FromSchema<typeof bodyAlbumSchema> }>(
    '/album',
    { schema: { body: bodyAlbumSchema } },
    async (req, rep) => {
      const { stickers, name } = req.body
      const { data, error } = await fastify.supabase()
        .from('albums')
        .insert({ stickers, name }).select()
      if (data?.length === 0) {
        return await rep.code(400)
      }
      return { data, error }
    }
  )
}

export default album
