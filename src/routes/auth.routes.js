const Auth = require('../auth')

async function routes (fastify, options) {
  fastify.get('/auth/login', (request, reply) => {
    reply.view('login')
  })

  fastify.get('/auth/logout', (request, reply, next) => {
    if (request.session.get('authenticated')) {
      request.session.delete()
    }
    reply.redirect('/auth/login')
  })

  fastify.post('/auth/login',
    {
      schema: {
        body: { $ref: '/auth/login#' }
      }
    },
    async (request, reply) => {
      const { email, password } = request.body
      if (!email || !password) {
        throw fastify.httpErrors.badRequest('You must provide email and password')
      }

      if (!Auth.isCorrectEmail(email)) {
        throw fastify.httpErrors.unauthorized()
      }
      if (!await Auth.isCorrectPassword(password)) {
        throw fastify.httpErrors.unauthorized()
      }

      request.session.set('authenticated', true)
      fastify.log.info('successful authentication')
      const url = request.session.get('postLoginUrl') || '/'
      request.session.set('postLoginUrl', null)
      reply.redirect(url)
    }
  )

  // fastify.setErrorHandler((error, request, reply) => {
  //   fastify.log.error(error)
  //   console.log('about to redirect.......')
  //   reply.code(401)
  //   reply.redirect('/login')
  // })
}

module.exports = routes
