const fp = require('fastify-plugin')

const plugin = async (fastify) => {
  const EMAIL_REGEX = '\\w[\\w+-.]+@([\\w-]+\\.\\w+)+$'

  fastify.addSchema({
    $id: '/auth/login',
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        pattern: EMAIL_REGEX
      }
    }
  })

  fastify.addSchema({
    $id: '/api/v1/ajax-headers',
    type: 'object',
    properties: {
      accept: {
        type: 'string',
        pattern: '^application/json$'
      }
    },
    required: ['accept']
  })

  fastify.addSchema({
    $id: '/api/v1/nodes.response.200',
    type: 'object',
    properties: {
      nodes: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            units: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  url: { type: 'string' }
                },
                required: ['name', 'url']
              }
            }
          },
          required: ['name']
        }
      }
    },
    required: ['nodes']
  })
}

module.exports = fp(plugin, {
  name: 'plugin-index'
})
