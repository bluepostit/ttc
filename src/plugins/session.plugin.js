const fs = require('fs')
const path = require('path')
const fp = require('fastify-plugin')
const flash = require('fastify-flash')

const plugin = async (fastify) => {
  fastify.register(require('fastify-secure-session'), {
    cookieName: 'lwtc-session',
    key: fs.readFileSync(path.join(__dirname, '../../secret-key')),
    cookie: {
      path: '/',
      httpOnly: true
    },
    expires: 1800000
  })
  fastify.register(flash)
}

module.exports = fp(plugin, {
  name: 'session',
  dependencies: ['config-checker']
})
