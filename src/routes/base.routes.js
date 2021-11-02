const path = require('path')
const fastifyStatic = require('fastify-static')

const clearLastUnit = (request) => {
  request.session.set('lastUnit', null)
}

async function routes (fastify, options) {
  fastify.get('/',
    {
      preValidation: fastify.auth.ensureSignedIn
    },
    (request, reply) => {
      reply.view('index')
    })

  fastify.get('/clearHistory',
    {
      preValidation: fastify.auth.ensureSignedIn
    },
    (request, reply) => {
      clearLastUnit(request)
      reply.redirect('/')
    }
  )

  fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../../public'),
    prefix: '/public/'
  })

  fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../../client/dist'),
    prefix: '/client/dist/',
    decorateReply: false
  })

  fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../../node_modules'),
    prefix: '/node_modules/',
    decorateReply: false
  })
}

module.exports = routes
