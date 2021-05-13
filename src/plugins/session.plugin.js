const fp = require('fastify-plugin')

const plugin = async (fastify) => {
  fastify.register(require('fastify-session'), {
    cookieName: 'sessionId',
    secret: process.env.SESSION_SECRET,
    cookie: { secure: false },
    expires: 1800000
  })
}

module.exports = fp(plugin, {
  name: 'session',
  dependencies: ['config-checker']
})
