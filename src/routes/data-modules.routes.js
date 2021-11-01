const path = require('path')
const fastifyStatic = require('fastify-static')

const routes = async (fastify) => {
  // Static route for data assets
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../../data/assets'),
    prefix: '/data/assets/',
    decorateReply: false
  })

  const entityNotFound = (entity, moduleIndex) => {
    throw fastify.httpErrors.notFound(
      `${entity} ${moduleIndex} not found`)
  }

  const storeUnitInSession = (request, moduleId, unitId) => {
    request.session.set('lastUnit', { moduleId, unitId })
  }

  fastify.get('/modules/:moduleId/units/:unitId/:resourceId',
    {
      preValidation: fastify.auth.ensureSignedIn,
      preHandler: fastify.loadDataModulesPreHandler
    },
    (request, reply) => {
      const { moduleId, unitId, resourceId } = request.params
      const module = request.dataModules.findModule(moduleId) ||
        entityNotFound('module', moduleId)
      const unit = module.findUnit(unitId) ||
        entityNotFound('unit', unitId)
      const resource = unit.findResource(resourceId) ||
        entityNotFound('resource', resourceId)

      try {
        const doc = request.parseResourceMarkdown(resource)
        storeUnitInSession(request, moduleId, unitId)
        reply.view('resource', {
          resource,
          content: doc
        })
      } catch (e) {
        console.log(e)
        console.error('Failed reading file!')
        throw fastify.httpErrors.internalServerError('Error processing document')
      }
    }
  )

  fastify.get('/modules/:moduleId/units/:unitId',
    {
      preValidation: fastify.auth.ensureSignedIn,
      preHandler: fastify.loadDataModulesPreHandler
    },
    (request, reply) => {
      const { moduleId, unitId } = request.params
      const module = request.dataModules.findModule(moduleId) ||
        entityNotFound('module', moduleId)
      const unit = module.findUnit(unitId) ||
        entityNotFound('unit', unitId)

      storeUnitInSession(request, moduleId, unitId)
      reply.view('unit', {
        unit,
        modules: request.dataModules,
        title: unit.name
      })
    })
}

module.exports = routes
