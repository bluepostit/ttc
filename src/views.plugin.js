const path = require('path')
const fp = require('fastify-plugin')
const POV = require('point-of-view')
const { Liquid } = require('liquidjs')

const plugin = async (fastify, options) => {
  // const VIEW_PATH = path.join(__dirname, '..', DATA_PATH)
  const VIEW_PATH = path.join(__dirname, 'views')

  const engine = new Liquid({
    root: './views', //VIEW_PATH,
    extname: '.liquid'
  })
  console.log(`Liquid view path: ${VIEW_PATH}`)

  fastify.register(POV, {
    engine: {
      liquid: engine,
    }
  })

  // fastify.get('/', (req, reply) => {
  //   console.log('HIT ROUTE')
  //   // reply.view('/home/yair/code/lewagon/lwtc/src/views/default.liquid')
  //   reply.view('./default')
  // })
}

module.exports = fp(plugin, {
  name: 'views',
  dependencies: ['config-checker']
})
