require('make-promises-safe')
require('./config/env').load()
const path = require ('path')

const fastify = require('fastify')({
  logger: true
})

fastify.register(require('fastify-sensible'))
fastify.register(require('fastify-formbody'))
fastify.register(require('fastify-cookie'))

fastify.register(require('./config/plugin'))

fastify.register(require('fastify-session'), {
  cookieName: 'sessionId',
  secret: process.env.SESSION_SECRET,
  cookie: { secure: true },
  expires: 1800000
})

fastify.register(require('./base/plugin'))
fastify.register(require('./views.plugin'))
fastify.register(require('./auth/plugin'))
fastify.register(require('./lw-modules/plugin'))

fastify.register(require('./base/routes'))
fastify.register(require('./auth/routes'))
fastify.register(require('./lw-modules/routes'))

module.exports = fastify
