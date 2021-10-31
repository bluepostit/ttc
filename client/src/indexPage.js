import Vue from 'vue'
import Index from './components/Index.vue'

const loadIndexPage = () => {
  const elementId = '#accordionIndex'
  if (!document.querySelector(elementId)) {
    return
  }
  // eslint-disable-next-line no-unused-vars
  const app = new Vue({
    el: '#accordionIndex',
    render: function (h) {
      return h(Index)
    }
  })
}

export { loadIndexPage }
