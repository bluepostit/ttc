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

const fetchCurrentNodeContent = async (state) => {
  const path = state.currentNode.node.absolutePath
  if (!path) {
    return null
  }

  const url = `/api/v1/nodes${path}`
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

const findChildNode = (parent, key, values) => {
  if (!Array.isArray(values)) {
    values = [values]
  }
  if (values.length > 1) {
    const firstValues = values.slice(0, values.length - 1)
    const lastValue = values[values.length - 1]
    const node = findChildNode(parent, key, firstValues)
    return findChildNode(node, key, lastValue)
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

const state = () => ({
  nodes: {},
  currentNode: {
    node: {
      parent: {}
    },
    path: null,
    content: null
  }
})

const getters = {
  nodes: (state) => {
    return state.nodes
  },

  currentNodeData: (state) => {
    return state.currentNode
  },

  currentNode: state => {
    return state.currentNode.node
  },

  currentNodeContent: state => {
    return state.currentNode.content
  }
  // getSelectedUnitId: (state) => (module) => {
  //   if (state.lastUnit && state.lastUnit.module.id === module.id) {
  //     return state.lastUnit.id
  //   }
  //   return null
  // },

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
    state.currentNode.path = node.absolutePath
    state.currentNode.node = node
    storeLocalData(state, false)
    return true
  }
  state.currentNode.path = path
  const foundNode = findNode(state, path)
  if (foundNode) {
    state.currentNode.node = foundNode
    storeLocalData(state, false)
    return true
  }
  return false
}

const loadCurrentNodeContent = async ({ state, commit }) => {
  const data = await fetchCurrentNodeContent(state)
  if (data && data.content) {
    commit('setCurrentNodeContent', data.content)
  }
}

const mutations = {
  setNodes (state, nodes) {
    state.nodes = nodes
    if (!nodes) {
      nodes = null
    }
    storeLocalData(state, true, false)
  },

  setCurrentNode,

  setCurrentNodeContent (state, content) {
    state.currentNode.content = content
  },

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

    // const lastUnit = LocalStore.get('lastUnit')
    // if (lastUnit) {
    //   commit('setLastUnit', lastUnit)
    // }

    if (state.currentNode.path) {
      const node = findNode(state, state.currentNode.path)
      if (node) {
        commit('setCurrentNode', { node })
        if (node.extension) {
          await loadCurrentNodeContent({ state, commit })
        }
      }
    }
  },

  loadNodeContent: async ({ commit, state }, { path }) => {
    commit('setCurrentNode', { path })
    loadCurrentNodeContent({ commit, state })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
