class Resource {
  constructor (data, unit) {
    this.data = data
    this.dataUnit = unit
  }

  get unit () {
    return this.dataUnit
  }

  get name () {
    return this.data.name
  }

  get path () {
    return this.data.path || null
  }
}

module.exports = Resource
