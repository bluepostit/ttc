const Unit = require('./unit')

const buildUnits = (data, module) => {
  if (!data.units) {
    return []
  }

  const units = data.units.map((unitObj) => {
    return new Unit(unitObj, module)
  })
  return units
}

class Module {
  constructor (data) {
    this.data = data

    this.dataUnits = buildUnits(data, this)
  }

  get name () {
    return this.data.name
  }

  get path () {
    return this.data.path
  }

  get units () {
    return this.dataUnits
  }

  /**
   * Try to find a Unit by its index or path property.
   * @param {string|integer} id
   */
  findUnit (id) {
    let unit = this.dataUnits.find((unit) => {
      return unit.path && unit.path === id
    })
    if (!unit) {
      unit = this.dataUnits[parseInt(id, 10)]
    }
    return unit
  }

  /**
   * Get identifier for this Unit.
   *
   * @param {Unit} unit
   * @returns the unit's `path` property if found, otherwise its index.
   */
  getUnitId (unit) {
    if (unit.path) {
      return unit.path
    } else {
      return this.dataUnits.indexOf(unit)
    }
  }
}

module.exports = Module
