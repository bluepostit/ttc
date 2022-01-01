const fp = require('fastify-plugin')
const fastifyEnv = require('fastify-env')

const schema = {
  type: 'object',
  required: [
    'PORT',
    'USER_EMAIL',
    'USER_PASSWORD',
    'SESSION_SECRET',
    'DATA_TREE_MANIFEST_PATH',
    'DATA_TREE_DATA_PATH',
    'CACHE_DB_PATH'
  ],
  properties: {
    PORT: {
      type: 'string',
      pattern: '\\d\\d+',
      default: 3000
    },
    DATA_TREE_MANIFEST_PATH: {
      type: 'string',
      default: 'data/manifest.yml'
    },
    DATA_TREE_DATA_PATH: {
      type: 'string',
      default: 'data'
    },
    USER_EMAIL: {
      type: 'string',
      pattern: '\\w[\\w+-.]+@([\\w-]+\\.\\w+)+$'
    },
    USER_PASSWORD: {
      type: 'string',
      minLength: 8
    },
    SESSION_SECRET: {
      type: 'string',
      minLength: 32
    },
    FRIENDLY_ERRORS: {
      type: 'boolean',
      default: false
    },
    DISABLE_AUTH: {
      type: 'boolean',
      default: false
    },
    VERSION_FILE_NAME: {
      type: 'string',
      default: 'version-info.yaml'
    },
    CACHE_DB_PATH: {
      type: 'string',
      default: 'cache'
    },
    CACHE_ENABLED: {
      type: 'boolean',
      default: true
    }
  }
}

const options = {
  dotenv: true,
  schema
}

const plugin = async (fastify) => {
  try {
    await fastify.register(fastifyEnv, options)
    fastify.log.info('Config validated')
  } catch (error) {
    fastify.log.error(error)
  }
}

module.exports = fp(plugin, {
  name: 'config-checker'
})
