// fastify.get('/', (req, reply) => {
//   console.log('HIT ROUTE')
//   reply.view('default.liquid', { title: 'The Title' })
//   // reply.view('./default')
// })
async function routes(fastify, options) {
  fastify.get('/', (request, reply) => {
    reply.view('src/views/index.njk', {
      modules: fastify.dataModules
    })
  })
}

module.exports = routes
