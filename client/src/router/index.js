import Vue from 'vue'
import VueRouter from 'vue-router'

import Index from '../pages/Index.vue'
import Unit from '../pages/Unit.vue'
import Resource from '../pages/Resource.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
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

export default router
