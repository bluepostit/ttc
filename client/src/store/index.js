import { LocalStore } from '../local-store'

export default class Store {
  constructor () {
    this.data = {
      modules: [],
      lastUnitData: {
        moduleId: null,
        unitId: null
      },
      lastUnit: {
        id: null,
        name: null,
        resources: [],
        module: { name: null, id: null }
      },
      signedIn: false
    }
    this.loadLocalData()
  }

  get modules () {
    return this.data.modules
  }

  set modules (modules) {
    this.data.modules = modules
  }

  get lastUnit () {
    return this.data.lastUnit
  }

  set lastUnit ({ moduleId, unitId }) {
    this.loadUnit(moduleId, unitId)
  }

  findUnit (moduleId, unitId) {
    let unit
    const module = this.data.modules
      .find(module => module.id === moduleId)
    if (module && module.id) {
      unit = module.units.find(unit => unit.id === unitId)
      if (unit) {
        unit.module.id = moduleId
      }
    }
    return unit
  }

  loadUnit (moduleId, unitId) {
    if (!moduleId || !unitId) {
      console.log('trying to load unit from param data')
      moduleId = this.data.lastUnitData.moduleId
      unitId = this.data.lastUnitData.unitId
    } else {
      this.data.lastUnitData = { moduleId, unitId }
    }

    const unit = this.findUnit(moduleId, unitId)
    if (unit) {
      this.data.lastUnit = unit
      this.storeData()
    }
  }

  loadLocalData () {
    console.log('loading module data from local storage')
    const modules = LocalStore.get('modules')
    if (modules) {
      this.data.modules = modules
    }

    // We were trying to load a unit's view
    if (this.data.lastUnitData.unitId) {
      return this.loadUnit()
    }
    const lastUnit = LocalStore.get('lastUnit')
    if (lastUnit) {
      this.data.lastUnit = lastUnit
    }
  }

  fetchData () {
    const url = '/api/v1/modules'
    fetch(url, {
      headers: {
        Accept: 'application/json'
      }
    }).then(res => res.json())
      .then((data) => {
        this.data.modules = data.modules
        if (this.data.lastUnitData.unitId) {
          this.loadUnit()
        }
        // lastUnit should not be affected by data fetch
        this.storeData(true, false)
      })
  }

  storeData (modules = true, lastUnit = true) {
    modules && LocalStore.set('modules', this.modules)
    lastUnit && LocalStore.set('lastUnit', this.lastUnit)
  }
}
