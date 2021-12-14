const path = require('path')
const fs = require('fs')
const fp = require('fastify-plugin')
const MarkdownIt = require('../markdown-it')

const VIEW_PATH_PREFIX = path.join(__dirname, '..', '..')
const DATA_PATH = process.env.MODULE_DATA_PATH

const parseResourceMarkdown = (request, resource) => {
  const resourceFilePath = request.dataModules.buildResourceFilePath(resource)
  let docPath = path.join(VIEW_PATH_PREFIX, DATA_PATH, resourceFilePath)
  if (!docPath.endsWith('.md')) {
    docPath += '.md'
  }
  request.log.info(`Resource file: ${docPath}`)
  const file = fs.readFileSync(docPath, 'utf8')
  const doc = MarkdownIt.render(file)
  return doc
}

const plugin = async (fastify, options) => {
  fastify.decorateRequest('parseResourceMarkdown', function (resource) {
    return parseResourceMarkdown(this, resource)
  })
}

module.exports = fp(plugin, {
  name: 'resource-markdown',
  dependencies: ['config-checker', 'data-tree']
})
