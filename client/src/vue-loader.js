import Vue from 'vue'
import router from './router'
import App from './components/App.vue'

Vue.config.productionTip = false

const loadVueForPage = () => {
  new Vue({
    router,
    render (createElement) {
      return createElement(App)
    }
  }).$mount('#app')
}

export { loadVueForPage }
