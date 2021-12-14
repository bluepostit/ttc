const fp = require('fastify-plugin')

const plugin = async (fastify) => {
  fastify.register(require('fastify-sensible'))
  fastify.register(require('fastify-formbody'))
  // fastify.register(require('fastify-cookie'))

  fastify.register(require('./config.plugin'))
  fastify.register(require('./session.plugin'))
  fastify.register(require('./flash-messages.plugin'))
  fastify.register(require('./base.plugin'))
  fastify.register(require('./auth.plugin'))
  fastify.register(require('./views.plugin'))
  fastify.register(require('./data-tree.plugin'))
  fastify.register(require('./resource-markdown.plugin'))
  fastify.register(require('./version-info.plugin'))
}

module.exports = fp(plugin, {
  name: 'plugin-index'
})
