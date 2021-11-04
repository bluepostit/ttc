// Using code-splitting for faster page load.
// https://webpack.js.org/guides/code-splitting/#dynamic-imports

const loadVueForPage = async () => {
  const { default: Vue } = await import('vue')
  const { default: router } = await import('./router')
  const { default: App } = await import('./components/App.vue')
  const { default: store } = await import('./store')

  Vue.config.productionTip = false

  const componentSelector = '#app'
  if (!document.querySelector(componentSelector)) {
    return
  }

  new Vue({
    router,
    store,
    render (createElement) {
      return createElement(App)
    }
  }).$mount(componentSelector)
}

export { loadVueForPage }
