const Auth = require('../auth')
const USER = {
  email: process.env.USER_EMAIL,
  password: process.env.USER_PASSWORD
}

const authSchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        pattern: '\\w[\\w+.]+@(\\w+\\.\\w+)+$'
      }
    }
  }
}

async function routes(fastify, options) {
  fastify.get('/auth/login', (request, reply) => {
    reply.view('login')
  })

  fastify.get('/auth/logout', async (request, reply, next) => {
    if (request.session.authenticated) {
      try {
        await request.destroySession()
        reply.redirect('/auth/login')
      } catch (error) {
        console.error(error)
        throw error
      }
    }
    reply.redirect('/auth/login')
  })

  fastify.post('/auth/login',
    {
      schema: authSchema
    },
    async (request, reply) => {
      const { email, password } = request.body
      if (!email || !password) {
        throw fastify.httpErrors.badRequest('You must provide email and password')
      }

      if (email !== USER.email) {
        throw fastify.httpErrors.unauthorized()
      }

      const matchingPassword = await Auth.compare(password, USER.password)
      if (!matchingPassword) {
        throw fastify.httpErrors.unauthorized()
      }

      request.session.authenticated = true
      console.info('successful authentication')
      reply.redirect('/')
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
