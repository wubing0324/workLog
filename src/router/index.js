import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'logList',
      component: () => import('@/pages/logList/index')
    },
    {
      path: '/logCreate',
      name: 'logCreate',
      component: () => import('@/pages/logCreate/index')
    },
    {
      path: '/logDetail',
      name: 'logDetail',
      component: () => import('@/pages/logDetail/index')
    },
    {
      path: '/logEdit',
      name: 'logEdit',
      component: () => import('@/pages/logEdit/index')
    },
    {
      path: '/logView',
      name: 'logView',
      component: () => import('@/pages/logView/index')
    }
  ]
})
