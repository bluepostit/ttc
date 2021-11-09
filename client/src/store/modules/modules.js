import { LocalStore } from '../../local-store'

const fetchModuleData = async () => {
  const url = '/api/v1/modules'
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json'
    }
  })
  const data = await res.json()
  return data
}

const fetchCurrentResourceData = async (state) => {
  const { moduleId, unitId } = state.currentUnitData
  const resourceId = state.currentResourceData.id

  const url = `/api/v1/modules/${moduleId}/units/${unitId}/${resourceId}`
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json'
    }
  })
  const data = await res.json()
  return data
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

const getEmptyResource = () => {
  return {
    id: null,
    content: null
  }
}

const state = () => ({
  modules: [],

  currentUnitData: {
    moduleId: null,
    unitId: null
  },

  currentResourceData: getEmptyResource(),

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
  },

  currentResourceData: state => state.currentResourceData
}

const setCurrentUnit = (state, { moduleId, unitId }) => {
  state.currentUnitData = { moduleId, unitId }
  const unit = findUnit(state, state.currentUnitData)
  if (unit) {
    state.lastUnit = unit
    storeLocalData(state, false)
    return true
  }
  return false
}

const loadCurrentResourceContent = async ({ state, commit }) => {
  const data = await fetchCurrentResourceData(state)
  if (data.content) {
    commit('setCurrentResourceContent', data.content)
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

  setCurrentUnit,

  setCurrentResource (state, { moduleId, unitId, resourceId }) {
    setCurrentUnit(state, { moduleId, unitId })
    if (state.currentResourceData.id !== resourceId) {
      state.currentResourceData = getEmptyResource()
      state.currentResourceData.id = resourceId
    }
  },

  setCurrentResourceContent (state, content) {
    state.currentResourceData.content = content
  },

  setLastUnit (state, unit) {
    state.lastUnit = unit
    storeLocalData(state, false)
  },

  clearLastUnit (state) {
    state.lastUnit = getEmptyUnit()
    state.currentResourceData = getEmptyResource()
    storeLocalData(state, false)
  },

  clear (state) {
    LocalStore.clear()
    state.modules = []
    state.lastUnit = getEmptyUnit()
    state.currentResourceData = getEmptyResource()
  }
}

const actions = {
  load: async ({ state, commit }) => {
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

    if (state.currentResourceData.id) {
      await loadCurrentResourceContent({ state, commit })
    }
  },

  loadResource: async ({ commit, state }, { moduleId, unitId, resourceId }) => {
    commit('setCurrentResource', { moduleId, unitId, resourceId })
    loadCurrentResourceContent({ commit, state })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
