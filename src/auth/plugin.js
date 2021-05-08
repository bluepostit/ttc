const fp = require('fastify-plugin')

const plugin = async (fastify) => {
  const ensureSignedIn = (request, reply, next) => {
    fastify.log.info(process.env.DISABLE_AUTH)
    if (process.env.DISABLE_AUTH == 'true') {
      return next()
    }

    if (!request.session.authenticated) {
      throw fastify.httpErrors.unauthorized(
        'You must sign in first'
      )
    }
    // Add this info to enable all views to access it as a global
    reply.locals = {
      signedIn: true
    }
    next()
  }

  fastify.decorate('auth', {
    ensureSignedIn
  })
}

module.exports = fp(plugin)
