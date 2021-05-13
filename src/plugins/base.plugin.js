const fp = require('fastify-plugin')

const plugin = async (fastify) => {
  if(process.env.NODE_ENV !== 'production') {
    if (process.env.FRIENDLY_ERRORS) {
      fastify.register(require('fastify-error-page'))
    }
  }

  fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error)
    reply.view('error', { error })
  })

  fastify.setNotFoundHandler((request, reply) => {
    fastify.log.error(`Not found: ${request.url}`)
    reply.view('error', {
      error: {
        message: 'Not found'
      }
    })
  })
}

module.exports = fp(plugin, {
  dependencies: ['config-checker']
})
