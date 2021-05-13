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

  /**
   * Try to find a Module by its index or path property.
   * @param {string|integer} id
   */
  findModule (id) {
    let module = this.modules.find((module) => {
      return module.path && module.path === id
    })
    if (!module) {
      module = this.modules[parseInt(id, 10)]
    }
    return module
  }

  /**
   * Get identifier for this Unit.
   *
   * @param {Module} module
   * @returns the module's `path` property if found, otherwise its index.
   */
  getModuleId (module) {
    if (module.path) {
      return module.path
    } else {
      return this.modules.indexOf(module)
    }
  }

  buildUnitURL (unit) {
    const module = unit.module
    const moduleId = this.getModuleId(module)
    const unitId = module.getUnitId(unit)
    return `/modules/${moduleId}/units/${unitId}`
  }

  buildResourceURL (resource) {
    const prefix = this.buildUnitURL(resource.unit)
    return `${prefix}/${resource.path || resource.name}`
  }

  buildResourceFilePath (resource) {
    const unit = resource.unit
    const module = unit.module
    const moduleId = this.getModuleId(module)
    const unitId = module.getUnitId(unit)
    return `${moduleId}/${unitId}/${resource.path || resource.name}`
  }
}

const plugin = async (fastify, options, next) => {
  const pathSuffix = process.env.MODULE_MANIFEST_PATH
  const pathPrefix = path.join(__dirname, '..', '..')
  const modulesFilePath = path.join(pathPrefix, pathSuffix)
  fastify.log.info(`Reading modules file at ${modulesFilePath}`)
  try {
    const file = fs.readFileSync(modulesFilePath, 'utf8')
    const doc = yaml.load(file)
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
