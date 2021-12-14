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

  get id () {
    return this.path || this.name
  }

  get url () {
    return `${this.unit.url}/${this.id}`
  }

  toJSON () {
    return {
      id: this.id,
      name: this.name,
      url: this.url
    }
  }
}

module.exports = Resource
