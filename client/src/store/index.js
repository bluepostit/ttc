import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import modules from './modules/modules'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    modules,
    auth
  }
})
