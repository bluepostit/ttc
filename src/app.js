require('make-promises-safe')
require('./config/env').load()

const fastify = require('fastify')({
  logger: true
})

fastify.register(require('./plugins/index.plugin'))
fastify.register(require('./routes/index.routes'))

module.exports = fastify
