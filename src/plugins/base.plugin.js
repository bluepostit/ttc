const fp = require('fastify-plugin')
const accepts = require('fastify-accepts')

const plugin = async (fastify) => {
  fastify.register(accepts)

  if (process.env.NODE_ENV !== 'production') {
    if (process.env.FRIENDLY_ERRORS) {
      fastify.register(require('fastify-error-page'))
    }
  }

  fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error)
    const accept = request.accepts() // Accepts object
    switch (accept.type(['json', 'html'])) {
      case 'json':
        reply.send(JSON.stringify(error))
        break
      case 'html':
        reply.view('error', { error })
        break
    }
  })

  fastify.setNotFoundHandler((request, reply) => {
    fastify.log.error(`Not found: ${request.url}`)
    const response = {
      error: {
        message: 'Not found'
      }
    }
    const accept = request.accepts() // Accepts object
    switch (accept.type(['json', 'html'])) {
      case 'json':
        reply.send(JSON.stringify(response))
        break
      case 'html':
        reply.view('error', response)
        break
    }
  })
}

module.exports = fp(plugin, {
  dependencies: ['config-checker']
})
