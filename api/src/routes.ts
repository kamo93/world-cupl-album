async function routes(fastify: any) {
  fastify.get('/test', () => {
    return { hello: 'china' }
  })
}

export default routes;
