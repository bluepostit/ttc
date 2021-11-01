async function routes (fastify, options) {
  const entityNotFound = (entity, moduleIndex, reply) => {
    const response = {
      code: 404,
      error: `${entity} ${moduleIndex} not found`
    }
    reply.send(JSON.stringify(response))
  }

  const storeUnitInSession = (request, moduleId, unitId) => {
    request.session.set('lastUnit', { moduleId, unitId })
  }

  fastify.get('/modules',
    {
      preValidation: fastify.auth.ensureSignedIn,
      preHandler: fastify.loadDataModulesPreHandler,
      schema: {
        headers: { $ref: '/api/v1/ajax-headers#' },
        response: {
          200: { $ref: '/api/v1/modules.response.200#' }
        }
      }
    },
    (request, reply) => {
      const data = {
        modules: request.dataModules,
        lastUnit: request.session.get('lastUnit')
      }
      reply.send(JSON.stringify(data))
    }
  )

  fastify.get('/modules/:moduleId/units/:unitId',
    {
      preValidation: fastify.auth.ensureSignedIn,
      preHandler: fastify.loadDataModulesPreHandler,
      schema: {
        headers: { $ref: '/api/v1/ajax-headers#' }
      }
    },
    (request, reply) => {
      const { moduleId, unitId } = request.params
      const module = request.dataModules.findModule(moduleId) ||
        entityNotFound('module', moduleId, reply)
      const unit = module.findUnit(unitId) ||
        entityNotFound('unit', unitId, reply)

      storeUnitInSession(request, moduleId, unitId)
      reply.send(JSON.stringify({ unit }))
    }
  )
}

module.exports = routes
