<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
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
