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

  fastify.get('/modules/:moduleIndex/units/:unitIndex/:resourceId',
    {
      preValidation: fastify.auth.ensureSignedIn
    },
    (request, reply) => {
      const { moduleIndex, unitIndex, resourceId } = request.params
      const modules = request.dataModules.modules
      const module = modules[moduleIndex] ||
        entityNotFound('module', moduleIndex)
      const unit = module.units[unitIndex] ||
        entityNotFound('unit', unitIndex)
      const resource = unit.findResource(resourceId) ||
        entityNotFound('resource', resourceId)

      try {
        const doc = request.parseResourceMarkdown(resource)
        reply.view('resource', {
          title: `${resource.unit.name} | ${resource.name}`,
          content: doc,
        })
      } catch (e) {
        console.log(e)
        console.error('Failed reading file!')
        throw fastify.httpErrors.internalServerError('Error processing document')
      }
    }
  )

  fastify.get('/modules/:moduleIndex/units/:unitIndex',
    {
      preValidation: fastify.auth.ensureSignedIn
    },
    (request, reply) => {
      const { moduleIndex, unitIndex } = request.params
      const module = request.dataModules.modules[moduleIndex] ||
        entityNotFound('module', moduleIndex)
      const unit = module.units[unitIndex] ||
        entityNotFound('unit', unitIndex)

      reply.view('unit', {
        unit,
        modules: request.dataModules,
        title: unit.name
      })
    })
}

module.exports = routes
