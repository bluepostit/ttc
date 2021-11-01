const fs = require('fs')
const path = require('path')
const fp = require('fastify-plugin')
const yaml = require('js-yaml')
const Module = require('../data-modules/module')

const RELOAD_ONCE_FILE = 'reload-once'
const RELOAD_ALWAYS_FILE = 'reload-always'

const buildDataModules = (data) => {
  return data.map((moduleData, index) => {
    moduleData.index = index
    const module = new Module(moduleData)
    return module
  })
}

class Modules {
  constructor (data) {
    this.data = data
    this.dataModules = buildDataModules(data)
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

  buildResourceFilePath (resource) {
    const unit = resource.unit
    const module = unit.module
    const moduleId = module.id
    const unitId = module.getUnitId(unit)
    return `${moduleId}/${unitId}/${resource.path || resource.name}`
  }

  toJSON () {
    return this.dataModules
  }
}

const getModulesIndexFilePath = () => {
  const pathSuffix = process.env.MODULE_MANIFEST_PATH
  const pathPrefix = path.join(__dirname, '..', '..')
  return path.join(pathPrefix, pathSuffix)
}

const getModulesDirPath = () => {
  const pathSuffix = process.env.MODULE_DATA_PATH
  const pathPrefix = path.join(__dirname, '..', '..')
  return path.join(pathPrefix, pathSuffix)
}

const checkForReloadDirective = async () => {
  const modulesDir = getModulesDirPath()
  const reloadOnceFile = path.join(modulesDir, RELOAD_ONCE_FILE)
  const reloadAlwaysFile = path.join(modulesDir, RELOAD_ALWAYS_FILE)

  try {
    if (await fs.promises.access(reloadOnceFile, fs.constants.R_OK)) {
      console.log('Directive found: Reload module manifest once')
      return true
    }

    if (await fs.promises.access(reloadAlwaysFile, fs.constants.R_OK)) {
      console.log('Directive found: Reload module manifest always')
      return true
    }
  } catch (err) {
    console.log('No reload files found')
  }
  return false
}

const shouldLoadModules = async (request) => {
  if (!request.dataModules) {
    request.log.info('request.dataModules is empty')
    return true
  }
  if (!await checkForReloadDirective()) {
    request.log.info('No reload directives found')
    return false
  }
  return true
}

const buildModules = (log) => {
  const modulesFilePath = getModulesIndexFilePath()
  log.info(`Reading modules file at ${modulesFilePath}`)
  try {
    const file = fs.readFileSync(modulesFilePath, 'utf8')
    const doc = yaml.load(file)
    return new Modules(doc)
  } catch (e) {
    console.error(e)
    console.error('Failed reading module manifest file!')
    throw e
  }
}

const plugin = async (fastify, _options) => {
  const preHandler = async (request, _reply) => {
    if (await shouldLoadModules(request)) {
      const modules = buildModules(request.log)
      request.dataModules = modules
    }
  }
  fastify.decorateRequest('dataModules', null)
  fastify.decorate('loadDataModulesPreHandler', preHandler)
}

module.exports = fp(plugin, {
  name: 'data-module-manifest',
  dependencies: ['config-checker']
})
