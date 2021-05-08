const fp = require('fastify-plugin')

const plugin = async (fastify) => {
  fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error)
    reply.type('text/html')
    reply.sendFile('error.html')
  })
}

module.exports = fp(plugin)
