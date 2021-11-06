const Auth = require('../auth')

async function routes (fastify, options) {
  const entityNotFound = (entity, moduleIndex, reply) => {
    const response = {
      code: 404,
      error: `${entity} ${moduleIndex} not found`
    }
    reply.send(JSON.stringify(response))
  }

  const loadUnit = (request, reply) => {
    const { moduleId, unitId } = request.params
    const module = request.dataModules.findModule(moduleId) ||
      entityNotFound('module', moduleId, reply)
    const unit = module.findUnit(unitId) ||
      entityNotFound('unit', unitId, reply)

    return unit
  }

  fastify.get('/auth-check',
    {
      schema: {
        headers: { $ref: '/api/v1/ajax-headers#' }
      }
    },
    (request, reply) => {
      const data = {
        auth: {
          active: reply.locals.useAuth,
          signedIn: reply.locals.signedIn || false,
          versionInfo: request.versionInfo
        }
      }
      reply.send(JSON.stringify(data))
    }
  )

  fastify.post('/auth/login',
    {
      schema: {
        body: { $ref: '/auth/login#' }
      }
    },
    async (request, reply) => {
      const { email, password } = request.body
      if (!email || !password) {
        throw fastify.httpErrors.badRequest('You must provide email and password')
      }

      if (!Auth.isCorrectEmail(email)) {
        throw fastify.httpErrors.unauthorized()
      }
      if (!await Auth.isCorrectPassword(password)) {
        throw fastify.httpErrors.unauthorized()
      }

      request.session.set('authenticated', true)
      fastify.log.info('successful authentication')
      reply.send(JSON.stringify({
        signedIn: true
      }))
    }
  )

  fastify.get('/auth/logout',
    (request, reply) => {
      if (request.session.get('authenticated')) {
        request.session.delete()
      }
      reply.send(JSON.stringify({}))
    }
  )

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
        modules: request.dataModules
      }
      reply.send(JSON.stringify(data))
    }
  )

  fastify.get('/modules/:moduleId/units/:unitId/:resourceId',
    {
      preValidation: fastify.auth.ensureSignedIn,
      preHandler: fastify.loadDataModulesPreHandler,
      schema: {
        headers: { $ref: '/api/v1/ajax-headers#' }
      }
    },
    (request, reply) => {
      const unit = loadUnit(request, reply)
      const { resourceId } = request.params
      const resource = unit.findResource(resourceId) ||
        entityNotFound('resource', resourceId)
      let response
      try {
        const content = request.parseResourceMarkdown(resource)
        response = {
          content
        }
      } catch (e) {
        console.log(e)
        console.error('Failed reading file!')
        response = {
          code: 500,
          error: 'Error processing document'
        }
      }
      reply.send(JSON.stringify(response))
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
      const unit = loadUnit(request, reply)
      reply.send(JSON.stringify({ unit }))
    }
  )
}

module.exports = routes
