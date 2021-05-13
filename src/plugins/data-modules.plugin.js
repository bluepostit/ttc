const fs = require('fs')
const path = require('path')
const fp = require('fastify-plugin')
const yaml = require('js-yaml')
const Module = require('../data-modules/module')

const buildModules = (data) => {
  return data.map((moduleData) => {
    return new Module(moduleData)
  })
}

class Modules {
  constructor (data) {
    this.data = data
    this.dataModules = buildModules(data)
  }

  get modules () {
    return this.dataModules
  }

  getModuleIndex (module) {
    return this.modules.indexOf(module)
  }

  getUnitIndex (unit) {
    return unit.module.units.indexOf(unit)
  }

  buildUnitURL (unit) {
    const moduleIndex = this.getModuleIndex(unit.module)
    const unitIndex = this.getUnitIndex(unit)
    return `/modules/${moduleIndex}/units/${unitIndex}`
  }

  buildResourceURL (resource) {
    const prefix = this.buildUnitURL(resource.unit)
    return `${prefix}/${resource.file || resource.name}`
  }

  buildResourceFilePath (resource) {
    const unit = resource.unit
    const moduleIndex = this.getModuleIndex(unit.module)
    const unitIndex = this.getUnitIndex(unit)
    return `${moduleIndex}/${unitIndex}/${resource.file || resource.name}`
  }
}

const plugin = async (fastify, options, next) => {
  const pathSuffix = process.env.MODULE_MANIFEST_PATH
  const pathPrefix = path.join(__dirname, '..', '..')
  const modulesFilePath = path.join(pathPrefix, pathSuffix)
  fastify.log.info(`Reading modules file at ${modulesFilePath}`)
  try {
    const file = fs.readFileSync(modulesFilePath, 'utf8')
    const doc = await yaml.load(file)
    const modules = new Modules(doc)
    fastify.decorateRequest('dataModules', modules)
  } catch (e) {
    console.error(e)
    console.error('Failed reading module manifest file!')
  }
}

module.exports = fp(plugin, {
  name: 'data-module-manifest',
  dependencies: ['config-checker']
})
