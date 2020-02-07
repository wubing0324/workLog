<template>
  <div class="logDetail">
    <van-button type="default" @click="changeDay('prev')">前一天</van-button>
    <van-button type="default" @click="goLogList">{{ formatDate }}</van-button>
    <van-button type="default" @click="changeDay('next')">后一天</van-button>
  </div>
</template>

<script>
import day from 'dayjs'

export default {
  name: 'logDetail',
  data () {
    return {
      day: day,
      date: day(),
      week: {
        0: '周日',
        1: '周一',
        2: '周二',
        3: '周三',
        4: '周四',
        5: '周五',
        6: '周六'
      }
    }
  },
  computed: {
    formatDate () {
      return `${this.date.format('YYYY年MM月DD')} ${this.week[this.date.format('d')]}`
    }
  },
  methods: {
    changeDay (type) {
      if (type === 'prev') {
        this.date = day(this.date).subtract(1, 'day')
        console.log(this.date)
      } else {
        this.date = day(this.date).add(1, 'day')
      }
    },
    goLogList () {
      this.$router.push({ name: 'logList', params: { defaultDate: this.date } })
    }
  }
}
</script>

<style lang="less">

</style>
