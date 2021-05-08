const path = require('path')
const fastifyStatic = require('fastify-static')

async function routes(fastify, options) {
  fastify.get('/', (request, reply) => {
    reply.view('src/views/index.njk', {
      modules: fastify.dataModules
    })
  })

  fastify.register(fastifyStatic, {
    root: path.join('/public'),
    prefix: '/public/',
  })

  fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../../client/dist'),
    prefix: '/client/dist/',
    decorateReply: false
  })
}

module.exports = routes
