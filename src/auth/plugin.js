const fp = require('fastify-plugin')

const plugin = async (fastify) => {
  const ensureSignedIn = (request, reply) => {
    if (!request.session.authenticated) {
      throw fastify.httpErrors.unauthorized(
        'You must sign in first'
      )
    }
  }

  fastify.decorate('auth', {
    ensureSignedIn
  })
}

module.exports = fp(plugin)
