const fp = require('fastify-plugin')

const plugin = async (fastify) => {
  fastify.addHook('preValidation', function (request, reply, done) {
    const useAuth = process.env.DISABLE_AUTH !== 'true'
    fastify.log.info(`Auth enabled? ${useAuth} - URL: ${request.url}`)
    const signedIn = request.session.get('authenticated')
    reply.locals = {
      useAuth,
      signedIn
    }

    return done()
  })

  const ensureSignedIn = (request, reply, next) => {
    if (reply.locals.useAuth && !reply.locals.signedIn) {
      request.session.set('postLoginUrl', request.url)
      request.flash('warning', 'You must sign in first')
      reply.redirect('/')
    }

    return next()
  }

  fastify.decorate('auth', {
    ensureSignedIn
  })
}

module.exports = fp(plugin, {
  dependencies: ['config-checker']
})
