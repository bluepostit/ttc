const path = require('path')
const fp = require('fastify-plugin')
const { open } = require('lmdb')

const openDb = (config) => {
  const dbPath = path.join(__dirname, '..', '..', config.CACHE_DB_PATH)
  const options = {
    encoding: 'json'
  }
  return open(dbPath, options)
}

const plugin = async (fastify, _options) => {
  const preHandler = async (request, _reply) => {
    const db = openDb(fastify.config)
    request.cacheDb = db
  }
  fastify.decorateRequest('cacheDb', null)
  fastify.decorate('loadCacheDb', preHandler)
}

module.exports = fp(plugin, {
  name: 'cache-db',
  dependencies: ['config-checker']
})
