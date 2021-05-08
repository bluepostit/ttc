const fs = require('fs')
const path = require ('path')
const fp = require('fastify-plugin')
const yaml = require('js-yaml')

class Modules {
  constructor(data) {
    this.moduleData = data
  }

  get data() {
    return this.moduleData
  }

  getModuleIndex(module) {
    return this.moduleData.findIndex((_module) => {
      return _module.name === module.name
    })
  }

  getUnitIndex(unit, module) {
    return module.units.findIndex((_unit) => {
      return _unit.name === unit.name
    })
  }

  buildUnitURL(module, unit) {
    const moduleIndex = this.getModuleIndex(module)
    const unitIndex = this.getUnitIndex(unit, module)
    return `/modules/${moduleIndex}/units/${unitIndex}`
  }

  buildResourceURL(module, unit, resource) {
    const prefix = this.buildUnitURL(module, unit)
    return `${prefix}/${resource.file || resource.name}`
  }
}

const plugin = async (fastify, options, next) => {
  const pathSuffix = process.env.MODULE_MANIFEST_PATH
  const pathPrefix = path.join(__dirname, '..', '..')
  const modulesFilePath = path.join(pathPrefix, pathSuffix)
  console.log(`Reading modules file at ${modulesFilePath}`)
  try {
    const file = fs.readFileSync(modulesFilePath, 'utf8')
    const doc = await yaml.load(file)
    const modules = new Modules(doc)
    fastify.decorate('dataModules', modules)
  } catch (e) {
    console.log(e)
    console.error('Failed reading module manifest file!')
  }
}

module.exports = fp(plugin, {
  name: 'lw-module-manifest',
  dependencies: ['config-checker']
})
