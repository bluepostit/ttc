const path = require('path')
const fastifyStatic = require('fastify-static')

async function routes (fastify, options) {
  fastify.get('/',
    (request, reply) => {
      reply.view('single-page-app')
    })

  // Static route for data assets
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../../data/assets'),
    prefix: '/data/assets/',
    decorateReply: false
  })

  fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../../public'),
    prefix: '/public/'
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
