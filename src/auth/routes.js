const Auth = require('./auth')
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
    reply.view('src/views/login.njk')
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
      if (matchingPassword) {
        request.session.authenticated = true
        reply.redirect('/')
      }
      throw fastify.httpErrors.unauthorized()
    }
  )

  fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error)
    reply.redirect('/auth/login')
  })
}

module.exports = routes
