import Vue from 'vue'
import VueRouter from 'vue-router'

import Index from '../pages/Index.vue'
import Node from '../pages/Node.vue'
import FileNode from '../pages/FileNode.vue'
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
      name: 'root',
      component: Index,
      meta: {
        needsAuth: true
      }
    },
    {
      path: '/nodes:path/file',
      name: 'file-node',
      component: FileNode,
      props: true,
      meta: {
        needsAuth: true
      }
    },
    {
      path: '/nodes:path',
      name: 'node',
      component: Node,
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
    if (to.name !== 'root') {
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
