import Vue from 'vue'
import Index from './pages/Index.vue'
import Unit from './pages/Unit.vue'
import Resource from './pages/Resource.vue'

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

const loadResourcePage = () => {
  const elementId = '.doc-content > .unit-resource > .content'
  if (!document.querySelector(elementId)) {
    return
  }
  return new Vue({
    el: elementId,
    render: function (h) {
      return h(Resource)
    }
  })
}

const loadVueForPage = () => {
  loadIndexPage() || loadUnitPage() || loadResourcePage()
}

export { loadVueForPage }
