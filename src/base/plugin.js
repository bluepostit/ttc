const fp = require('fastify-plugin')

const plugin = async (fastify) => {
  // fastify.setErrorHandler((error, request, reply) => {
  //   fastify.log.error(error)
  //   reply.type('text/html')
  //   reply.sendFile('error.html')
  // })

  // if(process.env.NODE_ENV !== 'production') {
  //   fastify.register(require('fastify-error-page'))
  // }

  fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error)
    reply.view('src/views/error.njk', { error })
  })
}

module.exports = fp(plugin)
