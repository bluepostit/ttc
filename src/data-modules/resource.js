class Resource {
  constructor(data, unit) {
    this.data = data
    this.dataUnit = unit
  }

  get unit() {
    return this.dataUnit
  }

  get name() {
    return this.data.name
  }

  get file() {
    return this.data.file || null
  }
}

module.exports = Resource
