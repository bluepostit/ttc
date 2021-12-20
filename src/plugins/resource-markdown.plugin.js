const path = require('path')
const fs = require('fs')
const fp = require('fastify-plugin')
const MarkdownIt = require('../markdown-it')

const VIEW_PATH_PREFIX = path.join(__dirname, '..', '..')
const DATA_PATH = process.env.DATA_TREE_DATA_PATH

const parseNodeFileContent = (request, filePath) => {
  const docPath = path.join(VIEW_PATH_PREFIX, DATA_PATH, filePath)
  request.log.info(`Node file: ${docPath}`)

  // Is it found in the cache db?
  const cached = request.cacheDb.get(filePath)
  if (cached) {
    request.log.info('Found cache')
    return cached
  }

  const file = fs.readFileSync(docPath, 'utf8')
  const doc = MarkdownIt.render(file)
  // Cache it
  request.cacheDb.put(filePath, doc)
  return doc
}

const plugin = async (fastify, options) => {
  fastify.decorateRequest('parseNodeFileContent', function (filePath) {
    return parseNodeFileContent(this, filePath)
  })
}

module.exports = fp(plugin, {
  name: 'resource-markdown',
  dependencies: ['config-checker', 'data-tree', 'cache-db']
})
