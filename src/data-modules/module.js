const Unit = require('./unit')

const buildUnits = (data, module) => {
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

  get units () {
    return this.dataUnits
  }
}

module.exports = Module
