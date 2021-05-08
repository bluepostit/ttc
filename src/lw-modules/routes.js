const path = require('path')
const fs = require('fs')
const MarkdownIt = require('markdown-it')()
const emoji = require('markdown-it-emoji')
const VIEW_PATH_PREFIX = path.join(__dirname, '..', '..')

MarkdownIt.use(emoji)

const resourceToMarkdown = (moduleIndex, unitIndex, resource) => {
  const DATA_PATH = process.env.MODULE_DATA_PATH
  let docPath = path.join(
    VIEW_PATH_PREFIX,
    DATA_PATH,
    `${moduleIndex}/${unitIndex}/${resource.name}`
  )
  if (!docPath.endsWith('.md')) {
    docPath += '.md'
  }
  const file = fs.readFileSync(docPath, 'utf8')
  const doc = MarkdownIt.render(file)
  return doc
}

const createResourceRoute = (fastify, resource, moduleIndex, unitIndex) => {
  const url = `/modules/${moduleIndex}/units/${unitIndex}/${resource.name}`
  fastify.get(url,
    {
      // preValidation: fastify.auth.ensureSignedIn
    },
    (_request, reply) => {
      try {
        const doc = resourceToMarkdown(moduleIndex, unitIndex, resource)
        // Doesn't work! Not sure why.
        // const templatePath = path.join(__dirname, '..', 'views/default.liquid')
        const templatePath = '/src/views/default.njk'
        reply.view(templatePath, {
          title: resource.title,
          content: doc
        })
      } catch (e) {
        console.log(e)
        console.error('Failed reading file!')
        throw reply.internalServerError('Error processing document')
      }
    })
}

const createUnitRoutes = (fastify, unit, moduleIndex, unitIndex) => {
  unit.resources.forEach((resource) => {
    createResourceRoute(fastify, resource, moduleIndex, unitIndex)
  })
}

const createModuleRoutes = (fastify, module, moduleIndex) => {
  const units = module.units
  if (!units) return

  for (let unitIndex = 0; unitIndex < units.length; unitIndex++) {
    const unit = units[unitIndex]
    createUnitRoutes(fastify, unit, moduleIndex, unitIndex)
  }
}

const routes = async (fastify) => {
  console.log('setting up routes...')
  const dataModules = fastify.dataModules.data
  for (let moduleIdx = 0; moduleIdx < dataModules.length; moduleIdx++) {
    const module = dataModules[moduleIdx]
    createModuleRoutes(fastify, module, moduleIdx)
  }

  fastify.get('/modules/:moduleIndex/units/:unitIndex',
    {
      // preValidation: fastify.auth.ensureSignedIn
    },
    (request, reply) => {
      const { moduleIndex, unitIndex } = request.params
      const module = fastify.dataModules.data[moduleIndex]
      const unit = module.units[unitIndex]

      const templatePath = '/src/views/unit.njk'
      reply.view(templatePath, {
        unit,
        module,
        unitIndex,
        moduleIndex,
        modules: fastify.dataModules,
      })
    })
}

module.exports = routes
