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

const setupBackButton = (router) => {
  const backButton = document.querySelector('.back-button')
  backButton && backButton.addEventListener('click', (e) => {
    if (router.currentRoute.name === 'unit') {
      router.push({ name: 'index' })
      return
    }
    router.go(-1)
  })
}

const showBackButton = (visible) => {
  const backButton = document.querySelector('.back-button')
  backButton.style.display = (visible ? '' : 'none')
}

const loadVueForPage = () => {
  const router = new VueRouter({
    routes,
    scrollBehavior: (to, from, savedPosition) => {
      if (to.name !== 'index') {
        return { x: 0, y: 0 }
      } else {
        // doesn't seem to work
        return savedPosition
      }
    }
  })

  setupBackButton(router)
  router.beforeEach((to, from, next) => {
    if (to.name === 'index') {
      showBackButton(false)
    } else {
      showBackButton(true)
    }
    next()
  })

  new Vue({
    router
  }).$mount('.doc-content')
}

export { loadVueForPage }
