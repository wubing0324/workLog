<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { authUserToken, queryOneDayUserHealthCount } from './apis/index.js'
import dayjs from 'dayjs'
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
    async queryOneDayUserHealthCount (userCenterId) {
      let searchDate = dayjs().format('YYYY-MM-DD')
      try {
        const response = await queryOneDayUserHealthCount({
          searchDate,
          userCenterId
        })
        if (response.data) {
          this.$router.push({name: 'success'})
        } else {
          this.$router.push({name: 'register'})
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getUserInfo () {
      const response = await authUserToken({'token': localStorage.token})
      let d = response && response.data
      let data = {
        empNo: d.empNo,
        name: d.nickName,
        userCenterId: d.userId
      }
      this.queryOneDayUserHealthCount(d.userId)
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
  font-size: 0.14rem;
}
* {
  padding: 0;
  margin: 0;
}
</style>
