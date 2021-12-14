const fp = require('fastify-plugin')

const plugin = async (fastify) => {
  fastify.register(require('./base.routes'))
  fastify.register(require('./schema'))
  fastify.register(require('./api-v1.routes'), { prefix: '/api/v1' })
}

module.exports = fp(plugin, {
  name: 'routes-index'
})
