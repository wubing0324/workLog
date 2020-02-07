<template>
  <div class="logList">
    <h1>工时日志</h1>
    <van-button @click="logCreate" type="default">新建日志</van-button>
  </div>
</template>

<script>
export default {
  name: 'logList',
  data () {
    return {
    }
  },
  methods: {
    logCreate () {
      this.$router.push({ name: 'logCreate', params: { logId: 1 } })
    }
  }
}
</script>

<style lang="less">

</style>
