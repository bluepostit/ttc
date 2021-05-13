const path = require('path')
const fastifyStatic = require('fastify-static')

async function routes(fastify, options) {
  fastify.get('/',
    {
      preValidation: fastify.auth.ensureSignedIn
    },
    (request, reply) => {
      reply.view('index', {
        modules: request.dataModules,
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

  fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../../node_modules'),
    prefix: '/node_modules/',
    decorateReply: false
  })
}

module.exports = routes
