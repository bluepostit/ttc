import Vue from 'vue'
import Index from './pages/Index.vue'
import Unit from './pages/Unit.vue'

const loadIndexPage = () => {
  const elementId = '#accordionIndex'
  if (!document.querySelector(elementId)) {
    return
  }
  return new Vue({
    el: elementId,
    render: function (h) {
      return h(Index)
    }
  })
}

const loadUnitPage = () => {
  const elementId = '.doc-content > .module-unit > .content'
  if (!document.querySelector(elementId)) {
    return
  }
  return new Vue({
    el: elementId,
    render: function (h) {
      return h(Unit)
    }
  })
}

const loadVueForPage = () => {
  loadIndexPage() || loadUnitPage()
}

export { loadVueForPage }
