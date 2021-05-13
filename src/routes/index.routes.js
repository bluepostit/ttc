const fp = require('fastify-plugin')

const plugin = async (fastify) => {
  fastify.register(require('./auth.routes'))
  fastify.register(require('./base.routes'))
  fastify.register(require('./data-modules.routes'))
}

module.exports = fp(plugin, {
  name: 'routes-index'
})
