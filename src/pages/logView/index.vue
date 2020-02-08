<template>
  <div class="logDetail">
    <p class="title">{{ date }}</p>
    <p class="tip">工作内容</p>
    <p class="content">{{ content }}</p>
    <p class="tip">工作时间</p>
    <p class="content">{{ hour }}</p>
  </div>
</template>

<script>
export default {
  name: 'logEdit',
  data () {
    return {
      hours: '',
      content: '',
      date: ''
    }
  },
  created () {
    const { defaultDate, info } = this.$route.params
    this.hour = info.hour
    this.content = info.content
    this.date = defaultDate
  },
  methods: {
    formatter (value) {
      // 过滤输入的数字
      return value.replace(/[^0-9]/g, '')
    }
  }
}
</script>

<style lang="less">
.logDetail{
  padding: 0 .13rem 0 .16rem;
  .title{
    font-size: .16rem;
    color: #191919;
    text-align: center;
    margin: 0.1rem 0 7px 0;
  }
  .tip{
    font-size: .14rem;
    color: #666666;
    text-align: left;
    margin: .2rem 0 0.04rem 0;
  }
  .content{
    font-size: .16rem;
    color: #191919;
    text-align: left;
    margin: .04rem 0 0.2rem 0;
  }
}
</style>
