const fp = require('fastify-plugin')
const fastifyEnv = require('fastify-env')

const schema = {
  type: 'object',
  required: [
    'PORT',
    'USER_EMAIL',
    'USER_PASSWORD',
    'SESSION_SECRET',
  ],
  properties: {
    PORT: {
      type: 'string',
      pattern: `\\d\\d+`
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
      minLength: 50
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

module.exports = fp(plugin)
