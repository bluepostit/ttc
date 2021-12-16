const path = require('path')
const fs = require('fs')
const fp = require('fastify-plugin')
const MarkdownIt = require('../markdown-it')

const VIEW_PATH_PREFIX = path.join(__dirname, '..', '..')
const DATA_PATH = process.env.DATA_TREE_DATA_PATH

const parseNodeFileContent = (request, filePath) => {
  let docPath = path.join(VIEW_PATH_PREFIX, DATA_PATH, filePath)
  if (!docPath.endsWith('.md')) {
    docPath += '.md'
  }
  request.log.info(`Node file: ${docPath}`)
  const file = fs.readFileSync(docPath, 'utf8')
  const doc = MarkdownIt.render(file)
  return doc
}

const plugin = async (fastify, options) => {
  fastify.decorateRequest('parseNodeFileContent', function (filePath) {
    return parseNodeFileContent(this, filePath)
  })
}

module.exports = fp(plugin, {
  name: 'resource-markdown',
  dependencies: ['config-checker', 'data-tree']
})
