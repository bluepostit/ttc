const path = require('path')
const fs = require('fs')
const fp = require('fastify-plugin')
const yaml = require('js-yaml')

const plugin = async (fastify) => {
  const VERSION_FILE_NAME = fastify.config.VERSION_FILE_NAME
  let versionInfo
  if (VERSION_FILE_NAME) {
    const VERSION_FILE_PATH = path.join(
      __dirname, '..', '..', VERSION_FILE_NAME)
    try {
      const file = fs.readFileSync(VERSION_FILE_PATH, 'utf8')
      file && (versionInfo = yaml.load(file))
    } catch (error) {
      fastify.log.error('Error reading version info file')
      fastify.log.error(error)
    }
  }
  fastify.decorateRequest('versionInfo', {
    getter () {
      return versionInfo
    }
  })
}

module.exports = fp(plugin, {
  name: 'version-info',
  dependencies: ['config-checker']
})
