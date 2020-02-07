// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import './components/vant/index'
import router from './router'
import 'vant/lib/button/style'
import Vconsole from 'vconsole'
const vConsole = new Vconsole()
Vue.use(vConsole)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
router.beforeEach((to, from, next) => {
  try {
    window.C3.setTitle({
      title: to.meta.title
    })
    next()
  } catch (error) {
    next()
  }
})
