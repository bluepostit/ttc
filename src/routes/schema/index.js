const fp = require('fastify-plugin')

const plugin = async (fastify) => {
  fastify.addSchema({
    $id: '/modules.headers',
    type: 'object',
    properties: {
      accept: {
        type: 'string',
        pattern: '^application/json$'
      }
    },
    required: ['accept']
  })
}

module.exports = fp(plugin, {
  name: 'plugin-index'
})
