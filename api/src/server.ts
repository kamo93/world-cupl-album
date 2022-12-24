import Fastify from 'fastify'
import appPlugin from './app.js'


const App = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid'
      }
    }
  }
})

const server = App.register(appPlugin)

// Start listening.
const port = process.env.PORT ? Number(process.env.PORT) : 3000
server.listen({ port }, (err) => {
  if (err) {
    server.log.error(err)
    process.exit(1)
  }
})
