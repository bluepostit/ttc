require('make-promises-safe')
require('./config/env').load()

const fastify = require('fastify')({
  logger: true
})

module.exports = async () => {
  await fastify.register(require('./plugins'))
  await fastify.register(require('./routes'))
  return fastify
}
