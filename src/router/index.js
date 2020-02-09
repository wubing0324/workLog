import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/logList'
    },
    {
      path: '/logList',
      name: 'logList',
      meta: {
        title: '工作日志'
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
      path: '/logEdit/:id',
      name: 'logEdit',
      meta: {
        title: '修改日志'
      },
      component: () => import('@/pages/logEdit/index')
    },
    {
      path: '/logView/:id',
      name: 'logView',
      meta: {
        title: '查看日志'
      },
      component: () => import('@/pages/logView/index')
    }
  ]
})
