<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { authUserToken } from './apis/loglist.js'
export default {
  name: 'App',
  created () {
    this.getUserInfo()
  },
  mounted () {
    var HTML = document.getElementsByTagName('html')[0]
    var initScreen = () => {
      var fontSize = document.documentElement.clientWidth / 375 * 625
      HTML.style.fontSize = fontSize + '%'
    }
    setTimeout(() => {
      initScreen()
      window.addEventListener('resize', function (e) { initScreen(e) }, false)
    }, 100)
  },
  methods: {
    async getUserInfo () {
      const response = await authUserToken({'token': localStorage.token})
      let d = response && response.data
      let data = {
        empNo: d.empNo,
        name: d.nickName,
        userCenterId: d.userId
      }
      localStorage.setItem('info', JSON.stringify(data))
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
