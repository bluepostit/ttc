const fp = require('fastify-plugin')
const flash = require('fastify-flash')

const plugin = async (fastify, options) => {
  fastify.register(flash)

  const hasContent = (flashes) => {
    return flashes && Object.getOwnPropertyNames(flashes).length > 0
  }

  fastify.addHook('preHandler', function (request, reply, done) {
    const flashes = reply.flash()
    if (hasContent(flashes)) {
      // This allows access to `flashes` from any view.
      reply.locals = {
        ...reply.locals,
        flashes
      }
    }
    done()
  })
}

module.exports = fp(plugin, {
  name: 'flash-messages',
  dependencies: ['session']
})
