import { LocalStore } from '../local-store'

class Store {
  constructor () {
    this.emptyData = {
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
      auth: {
        active: false,
        signedIn: false
      }
    }
    this.data = JSON.parse(JSON.stringify(this.emptyData))
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

  clearLastUnit () {
    this.data.lastUnitData = JSON.parse(JSON.stringify(this.emptyData.lastUnitData))
    this.data.lastUnit = JSON.parse(JSON.stringify(this.emptyData.lastUnit))
    this.storeData(false)
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

const store = new Store()

export default {
  load () {
    store.loadLocalData()
    store.fetchData()
  },

  get modules () {
    return store.modules
  },

  set modules (modules) {
    store.modules = modules
  },

  get lastUnit () {
    return store.lastUnit
  },

  set lastUnit ({ moduleId, unitId }) {
    store.lastUnit = { moduleId, unitId }
  },

  loadUnit (moduleId, unitId) {
    store.loadUnit(moduleId, unitId)
  },

  clearLastUnit () {
    store.clearLastUnit()
  }
}
