<template>
  <div class="logList">
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
      alert('create')
    }
  }
}
</script>

<style lang="less">

</style>
