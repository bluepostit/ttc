const fs = require('fs')
const path = require ('path')
const fp = require('fastify-plugin')
const yaml = require('js-yaml')

const plugin = async (fastify, options, next) => {
  const pathSuffix = process.env.MODULE_MANIFEST_PATH
  const pathPrefix = path.join(__dirname, '..', '..')
  const modulesFilePath = path.join(pathPrefix, pathSuffix)
  console.log(`Reading modules file at ${modulesFilePath}`)
  try {
    const file = fs.readFileSync(modulesFilePath, 'utf8')
    const doc = await yaml.load(file)
    fastify.decorate('dataModules', doc)
  } catch (e) {
    console.log(e)
    console.error('Failed reading module manifest file!')
  }
}

module.exports = fp(plugin, {
  name: 'lw-module-manifest',
  dependencies: ['config-checker']
})
