const fp = require('fastify-plugin')

const plugin = async (fastify) => {
  const ensureSignedIn = (request, reply, next) => {
    fastify.log.info(`Auth disabled? ${process.env.DISABLE_AUTH}`)
    if (request.session.authenticated) {
      // Add this info to enable all views to access it as a global
      reply.locals = {
        signedIn: true
      }
      return next()
    } else if (process.env.DISABLE_AUTH === 'true') {
      return next()
    }

    request.flash('warning', 'You must sign in first')
    reply.redirect('/auth/login')
  }

  fastify.decorate('auth', {
    ensureSignedIn
  })
}

module.exports = fp(plugin, {
  dependencies: ['config-checker']
})
