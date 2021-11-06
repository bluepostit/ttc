import Vue from 'vue'
import VueRouter from 'vue-router'

import Index from '../pages/Index.vue'
import Unit from '../pages/Unit.vue'
import Resource from '../pages/Resource.vue'
import Login from '../pages/Login.vue'

import store from '../store'

Vue.use(VueRouter)

const needToSignIn = () => {
  return store.getters['auth/active'] && !store.getters['auth/signedIn']
}

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      meta: {
        needsAuth: true
      }
    },
    {
      path: '/:moduleId/units/:unitId',
      name: 'unit',
      component: Unit,
      props: true,
      meta: {
        needsAuth: true
      }
    },
    {
      path: '/:moduleId/units/:unitId/:resourceId',
      name: 'resource',
      component: Resource,
      props: true,
      meta: {
        needsAuth: true
      }
    },
    {
      path: '/auth/login',
      name: 'login',
      component: Login
    }
  ],
  scrollBehavior: (to, from, savedPosition) => {
    if (to.name !== 'index') {
      return { x: 0, y: 0 }
    } else {
      // doesn't seem to work
      return savedPosition
    }
  }
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.needsAuth) && needToSignIn()) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
