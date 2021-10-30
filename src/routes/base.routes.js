const fs = require('fs/promises')
const path = require('path')
const fastifyStatic = require('fastify-static')

const getLastUnit = (request) => {
  const lastUnit = request.session.get('lastUnit')
  if (!lastUnit) {
    return null
  }
  const module = request.dataModules.findModule(lastUnit.moduleId)
  if (!module) {
    return null
  }
  const unit = module.findUnit(lastUnit.unitId)
  return unit
}

const clearLastUnit = (request) => {
  request.session.set('lastUnit', null)
}

async function routes (fastify, options) {
  fastify.get('/',
    {
      preValidation: fastify.auth.ensureSignedIn,
      preHandler: fastify.loadDataModulesPreHandler
    },
    (request, reply) => {
      const lastUnit = getLastUnit(request)
      reply.locals = reply.locals || {}
      reply.locals.lastUnit = lastUnit
      reply.view('index', {
        modules: request.dataModules,
        noBackButton: true,
        clearHistoryButton: lastUnit !== null
      })
    })

  fastify.get('/clearHistory',
    {
      preValidation: fastify.auth.ensureSignedIn
    },
    (request, reply) => {
      clearLastUnit(request)
      reply.redirect('/')
    }
  )

  fastify.register(fastifyStatic, {
    root: path.join('/public'),
    prefix: '/public/'
  })

  fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../../client/dist'),
    prefix: '/client/dist/',
    decorateReply: false
  })

  fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../../node_modules'),
    prefix: '/node_modules/',
    decorateReply: false
  })

  fastify.get('/service-worker.js',
    async (_request, reply) => {
      const filePath = path.join(__dirname, '../../public/service-worker.js')
      const file = await fs.readFile(filePath, { encoding: 'utf-8' })
      reply.header('Content-Type', 'text/javascript')
      reply.send(file)
    }
  )
}

module.exports = routes
