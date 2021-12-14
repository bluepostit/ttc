import { LocalStore } from '../../local-store'

const fetchNodeData = async () => {
  const url = '/api/v1/nodes'
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json'
    }
  })
  const data = await res.json()
  return data
}

// const fetchCurrentResourceData = async (state) => {
//   const { moduleId, unitId } = state.currentUnitData
//   const resourceId = state.currentResourceData.id

//   const url = `/api/v1/modules/${moduleId}/units/${unitId}/${resourceId}`
//   const res = await fetch(url, {
//     headers: {
//       Accept: 'application/json'
//     }
//   })
//   const data = await res.json()
//   return data
// }

const storeLocalData = (state, modules = true, lastUnit = true) => {
  modules && state.modules && LocalStore.set('modules', state.modules)
  lastUnit && state.lastUnit && LocalStore.set('lastUnit', state.lastUnit)
}

const findChildNode = (parent, key, values) => {
  if (!Array.isArray(values)) {
    values = [values]
  }
  if (values.length > 1) {
    const shorterValues = values.slice(0, values.length - 1)
    const node = findChildNode(parent, key, shorterValues)
    return findChildNode(node, key, values.slice(1))
  } else if (values.length === 1) {
    const found = parent.children.find((node) => {
      return node[key] === values[0]
    })
    return found || null
  }
}

const findNode = (state, path) => {
  let node
  if (state.nodes.children) {
    path = path.split('/').filter(part => part.length > 0)
    node = findChildNode(state.nodes, 'path', path)
  }
  return node
}

// const getEmptyUnit = () => {
//   return {
//     id: null,
//     name: null,
//     resources: [],
//     module: {
//       name: null,
//       id: null
//     }
//   }
// }

// const getEmptyResource = () => {
//   return {
//     id: null,
//     content: null
//   }
// }

const state = () => ({
  nodes: {},
  currentNodePath: null,
  currentNode: {
    parent: {}
  }
  // currentResourceData: getEmptyResource()
})

const getters = {
  nodes: (state) => {
    return state.nodes
  },

  currentNode: (state) => {
    return state.currentNode
  }

  // getSelectedUnitId: (state) => (module) => {
  //   if (state.lastUnit && state.lastUnit.module.id === module.id) {
  //     return state.lastUnit.id
  //   }
  //   return null
  // },

  // currentResourceData: state => state.currentResourceData,

  // nextResource: (state) => {
  //   const unit = state.lastUnit
  //   const resourceId = state.currentResourceData.id
  //   if (unit.id && resourceId) {
  //     const index = unit.resources.findIndex(res => res.id === resourceId)
  //     if (index !== null) {
  //       const nextResource = unit.resources[index + 1]
  //       return nextResource
  //     }
  //   }
  // }
}

const setCurrentNode = (state, { path = null, node = null }) => {
  if (node) {
    state.currentNodePath = node.absolutePath
    state.currentNode = node
    storeLocalData(state, false)
    return true
  }
  state.currentNodePath = path
  const foundNode = findNode(state, path)
  if (foundNode) {
    state.currentNode = foundNode
    storeLocalData(state, false)
    return true
  }
  return false
}

// const loadCurrentResourceContent = async ({ state, commit }) => {
//   const data = await fetchCurrentResourceData(state)
//   if (data.content) {
//     commit('setCurrentResourceContent', data.content)
//   }
// }

const mutations = {
  setNodes (state, nodes) {
    state.nodes = nodes
    if (!nodes) {
      nodes = null
    }
    storeLocalData(state, true, false)
  },

  setCurrentNode,

  // setCurrentResource (state, { moduleId, unitId, resourceId }) {
  //   setCurrentUnit(state, { moduleId, unitId })
  //   if (state.currentResourceData.id !== resourceId) {
  //     state.currentResourceData = getEmptyResource()
  //     state.currentResourceData.id = resourceId
  //   }
  // },

  // setCurrentResourceContent (state, content) {
  //   state.currentResourceData.content = content
  // },

  // setLastUnit (state, unit) {
  //   state.lastUnit = unit
  //   storeLocalData(state, false)
  // },

  // clearLastUnit (state) {
  //   state.lastUnit = getEmptyUnit()
  //   state.currentResourceData = getEmptyResource()
  //   storeLocalData(state, false)
  // },

  clear (state) {
    LocalStore.clear()
    state.nodes = {}
    // state.lastUnit = getEmptyUnit()
    // state.currentResourceData = getEmptyResource()
  }
}

const actions = {
  load: async ({ state, commit }) => {
    const nodes = LocalStore.get('nodes')
    commit('setNodes', nodes)
    const data = await fetchNodeData()
    commit('setNodes', data.nodes)

    const lastUnit = LocalStore.get('lastUnit')
    if (lastUnit) {
      commit('setLastUnit', lastUnit)
    }

    if (state.currentNodePath) {
      const node = findNode(state, state.currentNodePath)
      if (node) {
        commit('setCurrentNode', { node })
      }
    }

    // if (state.currentResourceData.id) {
    //   await loadCurrentResourceContent({ state, commit })
    // }
  }

  // loadResource: async ({ commit, state }, { moduleId, unitId, resourceId }) => {
  //   commit('setCurrentResource', { moduleId, unitId, resourceId })
  //   loadCurrentResourceContent({ commit, state })
  // }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
