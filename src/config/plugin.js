const fp = require('fastify-plugin')
const fastifyEnv = require('fastify-env')

const schema = {
  type: 'object',
  required: [
    'PORT',
    'USER_EMAIL',
    'USER_PASSWORD',
    'SESSION_SECRET',
    'MODULE_MANIFEST_PATH',
    'MODULE_DATA_PATH',
  ],
  properties: {
    PORT: {
      type: 'string',
      pattern: `\\d\\d+`,
      default: 3000,
    },
    MODULE_MANIFEST_PATH: {
      type: 'string',
      // default: 'data/modules.yml'
    },
    MODULE_DATA_PATH: {
      type: 'string'
    },
    USER_EMAIL: {
      type: 'string',
      pattern: '\\w[\\w+.]+@(\\w+\\.\\w+)+$'
    },
    USER_PASSWORD: {
      type: 'string',
      minLength: 8
    },
    SESSION_SECRET: {
      type: 'string',
      minLength: 32
    }
  }
}

const options = {
  dotenv: true,
  schema
}

const plugin = async (fastify) => {
  fastify.register(fastifyEnv, options)
    .ready((err) => {
      if (err) {
        console.error(err)
      } else {
        console.log('Config validated')
      }
    })
}

module.exports = fp(plugin, {
  name: 'config-checker'
})
