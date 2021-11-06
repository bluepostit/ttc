const fetchAuthData = async () => {
  const url = '/api/v1/auth-check'
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json'
    }
  })
  const data = await res.json()
  return data
}

const handleSignInError = ({ commit }, data) => {
  let errors = []
  if (data.validation) {
    errors = data.validation.map((item) => {
      let path = item.dataPath.replace(/[^\w\s]/g, '')
      path = path[0].toUpperCase() + path.substring(1)
      return `${path} has the wrong format`
    })
  } else {
    errors.push(data.message)
  }
  commit('setErrors', errors)
}

const postSignIn = async ({ commit }, data) => {
  const url = '/api/v1/auth/login'
  const res = await fetch(url, {
    method: 'post',
    headers: {
      Accept: 'application/json'
    },
    body: new URLSearchParams(data)
  })
  try {
    const json = await res.json()
    if (res.ok) {
      commit('setSignedIn', true)
      return true
    } else {
      handleSignInError({ commit }, json)
      return false
    }
    // go to Index?
  } catch (e) {
    return false
  }
}

const fetchSignOut = async () => {
  const url = '/api/v1/auth/logout'
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json'
    }
  })
  const data = await res.json()
  return data
}

const state = () => ({
  active: false,
  signedIn: false,
  errors: []
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
  },

  setErrors (state, errors) {
    state.errors = errors
  }
}

const actions = {
  load: async ({ commit }) => {
    const data = await fetchAuthData()
    commit('setAuthData', data.auth)
  },

  signIn: async ({ state, commit, dispatch }, { email, password }) => {
    if (state.active && !state.signedIn) {
      try {
        await postSignIn({ state, commit }, { email, password })
        await dispatch('modules/load', null, { root: true })
        return true
      } catch (e) {
        state.errors.length === 0 && state.errors.push('Something went wrong signing in')
        return false
      }
    }
    return true
  },

  signOut: async ({ state, commit }) => {
    await fetchSignOut({ state, commit })
    commit('setSignedIn', false)
    commit('modules/clear', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
