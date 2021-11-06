const state = () => ({
  info: [],
  warnings: []
})

const getters = {
  all: state => {
    return {
      info: state.info, warnings: state.warnings
    }
  }
}

const mutations = {
  setFlashes (state, { info = [], warnings = [] }) {
    state.info = info
    state.warnings = warnings
  },

  clearFlashes (state) {
    state.info = []
    state.warnings = []
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
