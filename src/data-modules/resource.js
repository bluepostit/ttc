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

  get url () {
    return `${this.unit.url}/${this.path || this.name}`
  }

  toJSON () {
    return {
      name: this.name,
      url: this.url
    }
  }
}

module.exports = Resource
