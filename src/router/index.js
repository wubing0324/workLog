import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/register'
    },
    {
      path: '/register',
      name: 'register',
      meta: {
        title: '疫情防控登记'
      },
      component: () => import('@/pages/register/index')
    },
    {
      path: '/success',
      name: 'success',
      meta: {
        title: '疫情防控登记'
      },
      component: () => import('@/pages/success/index')
    }
  ]
})
