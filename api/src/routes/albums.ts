import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts'
import { RealtimeChannel, RealtimeChannelSendResponse } from '@supabase/supabase-js'
import { FastifySchema } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'

const ALBUM_SYNC_ACTIONS = {
  add: 'add_sticker',
  remove: 'remove_sticker',
  set: 'set_album'
} as const

type ALBUM_SYNC_ACTIONS_TYPES = typeof ALBUM_SYNC_ACTIONS[keyof typeof ALBUM_SYNC_ACTIONS]

const album: FastifyPluginAsyncJsonSchemaToTs = async (fastify): Promise<void> => {
  const paramsAlbumSchema = {
    type: 'object',
    properties: {
      albumId: {
        type: 'string'
      }
    },
    additionalProperties: false,
    required: ['albumId']
  } as const
  const params: FastifySchema = { params: paramsAlbumSchema }
  fastify.get<{ Params: FromSchema<typeof paramsAlbumSchema> }>(
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

  const bodyPut = {
    type: 'object',
    properties: {
      userEmail: {
        type: 'string'
      }
    }
  } as const
  const putSchema: FastifySchema = { params: paramsAlbumSchema, body: bodyPut }
  fastify.put<{ Params: FromSchema<typeof paramsAlbumSchema>, Body: FromSchema<typeof bodyPut> }>(
    '/albums/:albumId',
    { schema: putSchema },
    async (req, res) => {
      const { albumId } = req.params
      const { userEmail } = req.body
      const { error: cleanSelectedError } = await fastify
        .supabase()
        .from('album_members')
        .update({ selected: false })
        .eq('selected', true)
        .eq('user_email', userEmail)
        .select('*')
      if (cleanSelectedError !== null) {
        fastify.log.error('cleanSelectedError')
        fastify.log.error(cleanSelectedError)
        return await res.code(500).send({ message: cleanSelectedError.hint })
      }
      // TODO this would be nice to a transaction
      // like batch commit
      const { error, data } = await fastify.supabase()
        .from('album_members')
        .update({ selected: true })
        .eq('album_id', albumId)
        .eq('user_email', userEmail)
        .select('*')
      fastify.log.error('error')
      fastify.log.error(error)
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

  const queryParamsAlbumsXUserSchema = {
    type: 'object',
    properties: {
      userEmail: {
        type: 'string'
      }
    },
    required: ['userEmail']
  } as const
  const albumsXUserSchema: FastifySchema = { params: queryParamsAlbumsXUserSchema }
  fastify.get<{ Params: FromSchema<typeof queryParamsAlbumsXUserSchema> }>(
    '/albums/user/:userEmail',
    { schema: albumsXUserSchema },
    async (req, res) => {
      const { userEmail } = req.params
      const { data, error } = await fastify
        .supabase()
        .from('albums')
        .select('id, name, album_members!inner(*)')
        .in('album_members.user_email', [userEmail])
      if (data === null) {
        fastify.log.error(error.message)
        await res.code(400)
      }
      if (error !== null) {
        fastify.log.error(error.message)
        await res.code(500).send({ message: error.hint })
      }
      if (data !== null) {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        return { data: data.map(({ name, id, album_members }) => ({ name, id, selected: album_members[0].selected })) }
      }
    }
  )

  fastify.get(
    '/albums',
    async (req, rep) => {
      const { data, error } = await fastify
        .supabase()
        .from('albums')
        .select('id, name')
      if (data?.length === 0) {
        await rep.code(400)
      }
      if (error !== null) {
        await rep.code(500).send({ message: error.hint })
      }
      return { data }
    }
  )

  const queryParamsAlbumPerEmailSchema = {
    type: 'object',
    properties: {
      userEmail: {
        type: 'string'
      },
      selected: {
        type: 'boolean'
      }
    },
    additionalProperties: false,
    required: ['userEmail']
  } as const
  const schemaAlbumQuery: FastifySchema = {
    querystring: queryParamsAlbumPerEmailSchema,
    response: {
      200: {
        type: 'object',
        properties: {
          data: {
            value: 'object',
            properties: {
              id: { type: 'string' },
              stickers: {
                type: 'object',
                patternProperties: {
                  '[a-zA-Z]{3}': {
                    type: 'object',
                    properties: {
                      figures: {
                        type: 'array'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  fastify.get<{ Querystring: FromSchema<typeof queryParamsAlbumPerEmailSchema> }>(
    '/album',
    { schema: schemaAlbumQuery },
    async (req, res) => {
      const { userEmail, selected } = req.query
      const { error, data } = await fastify.supabase()
        .from('albums')
        .select('id, stickers, album_members!inner(*)')
        .eq('album_members.selected', selected)
        .eq('album_members.user_email', userEmail)

      if (data?.length === 0) {
        return await res.code(404).send({ message: `Not users with the next email ${userEmail}` })
      }
      if (error !== null) {
        return await res.code(500).send({ message: error.hint })
      }
      return { data: data[0] }
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

  const querystringAlbumSyncSchema = {
    type: 'object',
    properties: {
      userEmail: {
        type: 'string'
      }
    },
    additionalProperties: false,
    required: ['userEmail']
  } as const
  const albumSyncSchema: FastifySchema = { querystring: querystringAlbumSyncSchema }
  fastify.get<{ Querystring: FromSchema<typeof querystringAlbumSyncSchema> }>(
    '/album-sync',
    { websocket: true, schema: albumSyncSchema },
    async (connection, request) => {
      fastify.log.info('socket start')
      fastify.log.info({ data: fastify.websocketServer.clients }, 'clients')
      const { userEmail } = request.query
      let stickers: any
      let channel: RealtimeChannel
      const { data, error } = await fastify.supabase()
        .from('albums')
        .select('*, album_members!inner(*)')
        .eq('album_members.selected', true)
        .eq('album_members.user_email', userEmail)
      if (data !== null && (data.length > 0)) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        stickers = data[0].stickers
        const albumId = data[0].id as string
        channel = fastify.supabase().channel(
          `channel:album:${albumId}`,
          { config: { broadcast: { self: true } } }
        )
        channel
          .on('presence', { event: 'join' }, (payload) => {
            console.log(`payload join - ws:${userEmail}`, payload)
          })
        channel
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          .on('broadcast', { event: 'update_album' }, async ({ payload }) => {
            fastify.log.info({ 'msg-channel': payload }, `channel ${payload.action as ALBUM_SYNC_ACTIONS_TYPES}`)
            const { number, code, origin, action } = payload
            const stickersPerCode = stickers[code].figures.map((sticker) => {
              if (sticker.value === number) {
                let newValue: number
                if (ALBUM_SYNC_ACTIONS.remove === action) {
                  newValue = sticker.repeat > 0 ? sticker.repeat - 1 : sticker.repeat // just remove when its positive you can't own stickers
                } else {
                  newValue = sticker.repeat as number + 1
                }
                return { ...sticker, repeat: newValue }
              }
              return sticker
            })
            stickers = {
              ...stickers,
              [code]: {
                figures: stickersPerCode
              }
            }
            connection.socket.send(JSON.stringify({ data: { name: data[0].name, stickers }, origin, action }))
            await fastify.supabase()
              .from('albums')
              .update({ stickers })
              .eq('id', albumId)
          })

        channel
          .on('presence', { event: 'leave' }, (payload) => {
            console.log(`payload leave - ws:${userEmail}`, payload)
          })

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        channel.subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            const presenceTrackStatus: RealtimeChannelSendResponse = await channel.track({
              userEmail
            })
            if (presenceTrackStatus === 'ok') {
              fastify.log.info('track new user')
            } else {
              fastify.log.error('track error')
            }
          }
        })

        // after connection created send initial sticker value
        connection.socket.send(JSON.stringify({ data: { name: data[0].name, stickers }, action: ALBUM_SYNC_ACTIONS.set }))
      }

      if (data.length === 0) {
        fastify.log.info(`User ${userEmail} doesn't have an album selected`)
        connection.socket.close()
      }

      if (error !== null) {
        connection.socket.close()
      }
      // TODO probably this channel shoould have an id the channel
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      connection.socket.on('message', async message => {
        const msg = JSON.parse(message.toString('utf8'))
        fastify.log.info({ 'msg-ws': msg }, 'message socket')
        const { number, code, origin, action } = msg
        await channel.send({ payload: { code, number, origin, action }, type: 'broadcast', event: 'update_album' })
      })

      connection.socket.on('open', () => {
        fastify.log.info('connection open')
        fastify.log.info({ data: fastify.websocketServer.clients }, 'clients')
        connection.socket.send('hi you there')
      })

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      connection.socket.on('close', async () => {
        fastify.log.info('connection close')
        fastify.log.info({ data: fastify.websocketServer.clients }, 'clients')
        if (channel) {
          await channel.unsubscribe()
        }
        connection.socket.close()
      })
    })
}

export default album
