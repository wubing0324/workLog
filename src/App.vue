<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { authUserToken } from './apis/loglist.js'
export default {
  name: 'App',
  mounted () {
    this.getUserInfo()
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
      const response = await authUserToken({'token': '67c585d8-0d4f-4ab7-bf2e-938118c3a6c9'})
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
