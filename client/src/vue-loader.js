import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from './pages/Index.vue'
import Unit from './pages/Unit.vue'
import Resource from './pages/Resource.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: Index
  },
  {
    path: '/:moduleId/units/:unitId',
    name: 'unit',
    component: Unit,
    props: true
  },
  {
    path: '/:moduleId/units/:unitId/:resourceId',
    name: 'resource',
    component: Resource,
    props: true
  }
]

const loadVueForPage = () => {
  const router = new VueRouter({ routes })
  new Vue({
    router
  }).$mount('.doc-content')
}

export { loadVueForPage }
