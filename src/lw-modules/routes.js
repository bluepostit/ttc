const path = require('path')
const fs = require('fs')
const MarkdownIt = require('markdown-it')()
const VIEW_PATH_PREFIX = path.join(__dirname, '..', '..')

const createRoute = (fastify, resource) => {
  fastify.get(resource.url,
  {
    // preValidation: fastify.auth.ensureSignedIn
  },
  (_request, reply) => {
    const DATA_PATH = process.env.MODULE_DATA_PATH
    const docPath = path.join(VIEW_PATH_PREFIX, DATA_PATH, resource.url)

    try {
      const file = fs.readFileSync(docPath, 'utf8')
      const doc = MarkdownIt.render(file)
      console.log(doc)
      // reply.send(doc)
      reply.view('./views/default.liquid', { content: doc })
    } catch (e) {
      console.log(e)
      console.error('Failed reading file!')
      throw reply.internalServerError('Error processing document')
    }
  })
}

const routes = async (fastify) => {
  console.log('setting up routes...')
  fastify.dataModules.forEach((module) => {
    if (!module.units) return

    module.units.forEach((unit) => {
      if (!unit.resources) return

      unit.resources.forEach(resource => createRoute(fastify, resource))
    })
  })
}

module.exports = routes
