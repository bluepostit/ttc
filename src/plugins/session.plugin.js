const fs = require('fs')
const path = require('path')
const fp = require('fastify-plugin')

const plugin = async fastify => {
  fastify.register(require('fastify-secure-session'), {
    cookieName: 'ttc-session',
    key: Buffer.from(process.env.COOKIE_KEY, 'hex'),
    cookie: {
      path: '/',
      httpOnly: true,
      sameSite: true,
      maxAge: 60 * 60 * 24 * 7 * 4 // 4 weeks
    }
  })
}

module.exports = fp(plugin, {
  name: 'session',
  dependencies: ['config-checker']
})
