const fs = require('fs')
const path = require('path')
const fp = require('fastify-plugin')
const yaml = require('js-yaml')
const TreeNode = require('data-tree')

class DataTree {
  constructor (data) {
    this.tree = new TreeNode(data)
  }

  /**
   * Try to find a Node by its path property.
   * @param {string} path
   */
  findNode (path) {
    return this.tree.findChildNode('path', path.split('/'))
  }

  toJSON () {
    return this.tree.toJSON()
  }
}

const getDataTreeManifestFilePath = (config) => {
  const pathSuffix = config.DATA_TREE_MANIFEST_PATH
  const pathPrefix = path.join(__dirname, '..', '..')
  return path.join(pathPrefix, pathSuffix)
}

const shouldLoadDataTree = (request) => {
  if (!request.dataTree) {
    request.log.info('request.dataTree is empty')
    return true
  }
  return true
}

const buildDataTree = (config, log) => {
  const dataTreeFilePath = getDataTreeManifestFilePath(config)
  log.info(`Reading data-tree file at ${dataTreeFilePath}`)
  try {
    const file = fs.readFileSync(dataTreeFilePath, 'utf8')
    const doc = yaml.load(file)
    return new DataTree(doc)
  } catch (e) {
    console.error(e)
    console.error('Failed reading data-tree manifest file!')
    throw e
  }
}

const plugin = async (fastify, _options) => {
  const preHandler = async (request, _reply) => {
    if (shouldLoadDataTree(request)) {
      const tree = buildDataTree(fastify.config, request.log)
      request.dataTree = tree
    }
  }
  fastify.decorateRequest('dataTree', null)
  fastify.decorate('loadDataTreePreHandler', preHandler)
}

module.exports = fp(plugin, {
  name: 'data-tree',
  dependencies: ['config-checker']
})
