import { LocalStore } from '../../local-store'

const fetchModuleData = async () => {
  const url = '/api/v1/modules'
  return fetch(url, {
    headers: {
      Accept: 'application/json'
    }
  }).then(res => res.json())
    .then(data => data)
}

const storeLocalData = (state, modules = true, lastUnit = true) => {
  modules && state.modules && LocalStore.set('modules', state.modules)
  lastUnit && state.lastUnit && LocalStore.set('lastUnit', state.lastUnit)
}

const findUnit = (state, { moduleId, unitId }) => {
  let unit
  const module = state.modules
    .find(module => module.id === moduleId)
  if (module && module.id) {
    unit = module.units.find(unit => unit.id === unitId)
    if (unit) {
      unit.module.id = moduleId
    }
  }
  return unit
}

const getEmptyUnit = () => {
  return {
    id: null,
    name: null,
    resources: [],
    module: {
      name: null,
      id: null
    }
  }
}

const state = () => ({
  modules: [],

  currentUnitData: {
    moduleId: null,
    unitId: null
  },

  lastUnit: getEmptyUnit()
})

const getters = {
  all: (state) => {
    return state.modules
  },

  lastUnit: (state) => {
    return state.lastUnit
  },

  getSelectedUnitId: (state) => (module) => {
    if (state.lastUnit && state.lastUnit.module.id === module.id) {
      return state.lastUnit.id
    }
    return null
  }
}

const mutations = {
  setModules (state, modules) {
    state.modules = modules
    if (!modules) {
      modules = []
    }
    storeLocalData(state, true, false)
  },

  setCurrentUnit (state, { moduleId, unitId }) {
    state.currentUnitData = { moduleId, unitId }
    const unit = findUnit(state, state.currentUnitData)
    if (unit) {
      state.lastUnit = unit
      storeLocalData(state, false)
    }
  },

  setLastUnit (state, unit) {
    state.lastUnit = unit
    storeLocalData(state, false)
  },

  clearLastUnit (state) {
    state.lastUnit = getEmptyUnit()
    storeLocalData(state, false)
  },

  clear (state) {
    LocalStore.clear()
    state.modules = []
    state.lastUnit = getEmptyUnit()
  }
}

const actions = {
  load: async ({ commit, state }) => {
    const modules = LocalStore.get('modules')
    commit('setModules', modules)
    const data = await fetchModuleData()
    commit('setModules', data.modules)

    const lastUnit = LocalStore.get('lastUnit')
    if (lastUnit) {
      commit('setLastUnit', lastUnit)
    }

    if (state.currentUnitData.unitId) {
      const unit = findUnit(state, state.currentUnitData)
      if (unit) {
        commit('setLastUnit', unit)
      }
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
