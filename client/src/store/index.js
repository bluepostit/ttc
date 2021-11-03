import { ModuleStore } from '../module-storage'

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
    const data = ModuleStore.retrieve()
    if (data) {
      console.log('loading data from local storage')
      this.data.modules = data.modules
      // We were trying to load a unit's view
      if (this.data.lastUnitData.unitId) {
        this.loadUnit()
      } else {
        this.lastUnit = data.lastUnit
      }
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
        if (!this.data.lastUnitData.unitId) {
          // this.lastUnit = data.lastUnit
        } else {
          this.loadUnit()
        }
        this.storeData()
      })
  }

  storeData () {
    ModuleStore.store({
      modules: this.modules,
      lastUnit: this.lastUnit
    })
  }
}
