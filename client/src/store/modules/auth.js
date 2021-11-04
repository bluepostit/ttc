const fetchAuthData = () => {
  const url = '/api/v1/auth-check'
  return fetch(url, {
    headers: {
      Accept: 'application/json'
    }
  }).then(res => res.json())
    .then(data => data)
}

const state = () => ({
  active: false,
  signedIn: false
})

const getters = {
  active: state => state.active,
  signedIn: state => state.signedIn
}

const mutations = {
  setAuthData (state, { active, signedIn }) {
    state.active = active
    state.signedIn = signedIn
  },

  setSignedIn (state, signedIn) {
    state.signedIn = signedIn
  }
}

const actions = {
  load: async ({ commit }) => {
    const data = await fetchAuthData()
    commit('setAuthData', data.auth)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
