const fs = require('fs')
const path = require('path')
const fp = require('fastify-plugin')
const yaml = require('js-yaml')
const TreeNode = require('@bluepostit/data-tree')

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

const loadDataTree = (request, config) => {
  const dataTreeFilePath = getDataTreeManifestFilePath(config)
  request.log.info(`Loading data-tree file ${dataTreeFilePath}`)

  // Is it in the cache?
  if (request.cacheDb) {
    const doc = request.cacheDb.get(dataTreeFilePath)
    if (doc) {
      request.log.info('found cache')
      return new DataTree(doc)
    }
  }

  try {
    const file = fs.readFileSync(dataTreeFilePath, 'utf8')
    const doc = yaml.load(file)
    // Cache it
    request.cacheDb && request.cacheDb.put(dataTreeFilePath, doc)
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
      const tree = loadDataTree(request, fastify.config)
      request.dataTree = tree
    }
  }
  fastify.decorateRequest('dataTree', null)
  fastify.decorate('loadDataTreePreHandler', preHandler)
}

module.exports = fp(plugin, {
  name: 'data-tree',
  dependencies: ['config-checker', 'cache-db']
})
