require('make-promises-safe')
require('./config/env').load()

const fastify = require('fastify')({
  logger: true
})

fastify.register(require('./plugins'))
fastify.register(require('./routes'))

module.exports = fastify
