const path = require('path')
const fp = require('fastify-plugin')
const POV = require('point-of-view')

const plugin = async (fastify, options) => {
  // const VIEW_PATH = path.join(__dirname, '..', DATA_PATH)
  const VIEW_PATH = path.join(__dirname, '..', 'views')

  fastify.log.info(`Template view path: ${VIEW_PATH}`)

  const engine = require('nunjucks')
  fastify.register(POV, {
    engine: {
      nunjucks: engine
    },
    root: VIEW_PATH,
    viewExt: 'njk',
    options: {
      autoescape: false
    }
  })
}

module.exports = fp(plugin, {
  name: 'views',
  dependencies: ['config-checker']
})
