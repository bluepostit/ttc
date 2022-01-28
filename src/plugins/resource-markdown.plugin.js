const path = require('path')
const fs = require('fs')
const fp = require('fastify-plugin')
const MarkdownIt = require('../markdown-it')

const VIEW_PATH_PREFIX = path.join(__dirname, '..', '..')

const parseNodeFileContent = (request, dataPath, filePath) => {
  const docPath = path.join(VIEW_PATH_PREFIX, dataPath, filePath)
  request.log.info(`Node file: ${docPath}`)

  // Is it found in the cache db?
  if (request.cacheDb) {
    const cached = request.cacheDb.get(filePath)
    if (cached) {
      request.log.info('Found cache')
      return cached
    }
  }

  const file = fs.readFileSync(docPath, 'utf8')
  const doc = MarkdownIt.render(file)
  // Cache it
  request.cacheDb && request.cacheDb.put(filePath, doc)
  return doc
}

const plugin = async (fastify, _options) => {
  fastify.decorateRequest('parseNodeFileContent', function (filePath) {
    const dataPath = fastify.config.DATA_TREE_DATA_PATH
    return parseNodeFileContent(this, dataPath, filePath)
  })
}

module.exports = fp(plugin, {
  name: 'resource-markdown',
  dependencies: ['config-checker', 'data-tree', 'cache-db']
})
