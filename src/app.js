require('make-promises-safe')
require('./config/env').load()
const path = require ('path')

const fastify = require('fastify')({
  logger: true
})

fastify.register(require('fastify-sensible'))
fastify.register(require('fastify-formbody'))
fastify.register(require('fastify-cookie'))

fastify.register(require('./config/env.plugin'))

fastify.register(require('fastify-session'), {
  cookieName: 'sessionId',
  secret: process.env.SESSION_SECRET,
  cookie: { secure: true },
  expires: 1800000
})


fastify.register(require('fastify-static'), {
  root: path.join(__dirname, '..', 'public'),
  prefix: '/public/',
})

fastify.register(require('./routes/auth.routes'))


module.exports = fastify
