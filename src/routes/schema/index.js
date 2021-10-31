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

  fastify.addSchema({
    $id: '/modules.response.200',
    type: 'object',
    properties: {
      modules: {
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
      },
      lastUnit: {
        type: 'object',
        properties: {
          moduleId: { type: 'integer' },
          unitId: { type: 'integer' }
        }
      }
    },
    required: ['modules', 'lastUnit']
  })
}

module.exports = fp(plugin, {
  name: 'plugin-index'
})
