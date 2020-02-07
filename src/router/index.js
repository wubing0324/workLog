import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'logList',
      meta: {
        title: '工时日志'
      },
      component: () => import('@/pages/logList/index')
    },
    {
      path: '/logCreate',
      name: 'logCreate',
      meta: {
        title: '新建日志'
      },
      component: () => import('@/pages/logCreate/index')
    },
    {
      path: '/logDetail',
      name: 'logDetail',
      meta: {
        title: '日志详情'
      },
      component: () => import('@/pages/logDetail/index')
    },
    {
      path: '/logEdit',
      name: 'logEdit',
      meta: {
        title: '修改日志'
      },
      component: () => import('@/pages/logEdit/index')
    },
    {
      path: '/logView',
      name: 'logView',
      meta: {
        title: '查看日志'
      },
      component: () => import('@/pages/logView/index')
    }
  ]
})
