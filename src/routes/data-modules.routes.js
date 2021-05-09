const path = require('path')
const fs = require('fs')
const fastifyStatic = require('fastify-static')
const md = require('markdown-it')
const emoji = require('markdown-it-emoji')
const highlightjs = require('markdown-it-highlightjs')
const VIEW_PATH_PREFIX = path.join(__dirname, '..', '..')

const MarkdownIt = md({ html: true})
MarkdownIt.use(emoji)
MarkdownIt.use(highlightjs)

const resourceToMarkdown = (moduleIndex, unitIndex, resource) => {
  const DATA_PATH = process.env.MODULE_DATA_PATH
  let docPath = path.join(
    VIEW_PATH_PREFIX,
    DATA_PATH,
    `${moduleIndex}/${unitIndex}/${resource.file || resource.name}`
  )
  if (!docPath.endsWith('.md')) {
    docPath += '.md'
  }
  const file = fs.readFileSync(docPath, 'utf8')
  const doc = MarkdownIt.render(file)
  return doc
}

const createResourceRoute = (fastify, module, unit, resource, moduleIndex, unitIndex) => {
  const url = fastify.dataModules.buildResourceURL(
    module,
    unit,
    resource
  )
  fastify.get(url,
    {
      preValidation: fastify.auth.ensureSignedIn
    },
    (request, reply) => {
      try {
        const doc = resourceToMarkdown(moduleIndex, unitIndex, resource)
        reply.view('resource', {
          title: `${unit.name} | ${resource.name}`,
          content: doc,
        })
      } catch (e) {
        console.log(e)
        console.error('Failed reading file!')
        throw fastify.httpErrors.internalServerError('Error processing document')
      }
    })
}

const createUnitRoutes = (fastify, module, unit, moduleIndex, unitIndex) => {
  unit.resources.forEach((resource) => {
    createResourceRoute(fastify, module, unit, resource, moduleIndex, unitIndex)
  })
}

const createModuleRoutes = (fastify, module, moduleIndex) => {
  const units = module.units
  if (!units) return

  for (let unitIndex = 0; unitIndex < units.length; unitIndex++) {
    const unit = units[unitIndex]
    createUnitRoutes(fastify, module, unit, moduleIndex, unitIndex)
  }
}

const routes = async (fastify) => {
  // Static route for data assets
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../../data/assets'),
    prefix: '/data/assets/',
    decorateReply: false
  })

  const dataModules = fastify.dataModules.data
  for (let moduleIdx = 0; moduleIdx < dataModules.length; moduleIdx++) {
    const module = dataModules[moduleIdx]
    createModuleRoutes(fastify, module, moduleIdx)
  }

  fastify.get('/modules/:moduleIndex/units/:unitIndex',
    {
      preValidation: fastify.auth.ensureSignedIn
    },
    (request, reply) => {
      const { moduleIndex, unitIndex } = request.params
      const module = fastify.dataModules.data[moduleIndex]
      const unit = module.units[unitIndex]

      if (!unit) {
        throw fastify.httpErrors.notFound(`Unit ${unitIndex} not found`)
      }

      reply.view('unit', {
        unit,
        module,
        unitIndex,
        moduleIndex,
        modules: fastify.dataModules,
        title: unit.name
      })
    })
}

module.exports = routes
