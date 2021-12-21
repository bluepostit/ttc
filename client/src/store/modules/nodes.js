import { LocalStore } from '../../local-store'

/** AJAX: fetch data **/

const fetchAllNodes = async () => {
  const url = '/api/v1/nodes'
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json'
    }
  })
  const data = await res.json()
  return data
}

const fetchNodeContent = async (path) => {
  const url = `/api/v1/nodes${path}`
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json'
    }
  })
  const data = await res.json()
  return data
}

/** LocalStorage: store and retrieve data **/

const storeLocalData = (state, keys) => {
  keys.forEach(key => {
    LocalStore.set(key, state[key])
  })
}

const loadLocalData = (commit, key, mutation) => {
  const data = LocalStore.get(key)
  if (data) {
    commit(mutation, data)
  }
}

/** Utility functions to find and work with nodes **/

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

const findNextFileNode = (state, currentFileNode) => {
  if (!currentFileNode || !currentFileNode.parent) {
    return null
  }
  const parent = findNode(state, currentFileNode.parent.absolutePath)
  return parent.children[currentFileNode._index + 1]
}

const getEmptyCurrentNode = () => ({
  node: {
    parent: {}
  },
  path: null,
  content: null
})

const setCurrentNode = (state, { path = null, node = null }) => {
  if (node) {
    state.currentNode.path = node.absolutePath
    state.currentNode.node = node
    storeLocalData(state, ['currentNode'])
    return true
  }
  state.currentNode.path = path
  const foundNode = findNode(state, path)
  if (foundNode) {
    state.currentNode.node = foundNode
    storeLocalData(state, ['currentNode'])
    return true
  }
  return false
}

const loadCurrentNodeContent = async ({ state, commit }) => {
  const currentNode = state.currentNode.node
  const path = currentNode.absolutePath
  if (!path) {
    return null
  }
  const data = await fetchNodeContent(path)
  if (data && (data.content !== null && data.content !== undefined)) {
    commit('setCurrentNodeContent', data.content)
    commit('setLastFileNode')
    const nextFileNode = findNextFileNode(state, currentNode)
    commit('setNextFileNode', nextFileNode)
  }
}

/** State module's components */

const state = () => ({
  nodes: {},
  currentNode: getEmptyCurrentNode(),
  lastFileNode: null,
  nextFileNode: null
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
  },

  isSelected: state => node => {
    return state.lastFileNode &&
      (state.lastFileNode.indexOf(node.absolutePath) === 0)
  },

  nextNode: state => {
    return state.nextFileNode
  }
}

const mutations = {
  setNodes (state, nodes) {
    state.nodes = nodes
    if (!nodes) {
      nodes = null
    }
    storeLocalData(state, ['nodes'])
  },

  setCurrentNode,

  setCurrentNodeContent (state, content) {
    state.currentNode.content = content
  },

  setLastFileNode (state, path = state.currentNode.path) {
    state.lastFileNode = path
    storeLocalData(state, ['lastFileNode'])
  },

  setNextFileNode (state, node) {
    state.nextFileNode = node
    storeLocalData(state, ['nextFileNode'])
  },

  clearLastFileNode (state) {
    state.lastFileNode = null
    state.nextFileNode = null
    state.currentNode = getEmptyCurrentNode()
    storeLocalData(state, ['lastFileNode', 'nextFileNode', 'currentNode'])
  },

  clear (state) {
    state.nodes = {}
    this.commit('nodes/clearLastFileNode')
    LocalStore.clear()
  }
}

const actions = {
  load: async ({ state, commit }) => {
    // Load data from local storage
    loadLocalData(commit, 'nodes', 'setNodes')
    loadLocalData(commit, 'lastFileNode', 'setLastFileNode')
    const currentNode = LocalStore.get('currentNode')
    if (currentNode) {
      setCurrentNode(state, currentNode)
    }

    // Now load them from the server
    const data = await fetchAllNodes()
    commit('setNodes', data.nodes)

    if (state.currentNode.path) {
      const node = findNode(state, state.currentNode.path)
      if (node) {
        commit('setCurrentNode', { node })
        // It's a file node:
        if (node.extension) {
          await loadCurrentNodeContent({ state, commit })
        }
      }
    }
  },

  loadNodeContent: async ({ commit, state }, { path }) => {
    commit('setCurrentNode', { path })
    commit('setCurrentNodeContent', null)
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
