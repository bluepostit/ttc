require('make-promises-safe')
require('./config/env').load()

const fastify = require('fastify')({
  logger: true
})

fastify.register(require('fastify-sensible'))
fastify.register(require('fastify-formbody'))
fastify.register(require('fastify-cookie'))

fastify.register(require('./plugins/config.plugin'))

fastify.register(require('fastify-session'), {
  cookieName: 'sessionId',
  secret: process.env.SESSION_SECRET,
  cookie: { secure: false },
  expires: 1800000
})

fastify.register(require('./plugins/base.plugin'))
fastify.register(require('./plugins/auth.plugin'))
fastify.register(require('./plugins/views.plugin'))
fastify.register(require('./plugins/data-modules.plugin'))
fastify.register(require('./plugins/resource-markdown.plugin'))

fastify.register(require('./routes/base.routes'))
fastify.register(require('./routes/auth.routes'))
fastify.register(require('./routes/data-modules.routes'))

module.exports = fastify
