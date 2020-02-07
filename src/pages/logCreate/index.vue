<template>
  <div class="logCreate">
    <van-cell title="选择单个日期" :value="formatDate" title-style="text-align: left" @click="show = true" is-link />
    <van-calendar v-model="show" :show-confirm="false" @confirm="onConfirm" />
  </div>
</template>

<script>
export default {
  name: 'logCreate',
  data () {
    return {
      date: '',
      show: false,
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
      let month = this.date.getMonth() + 1
      month = month > 9 ? month : '0' + month
      let day = this.date.getDate()
      day = day > 9 ? day : '0' + day
      return `${month}月${day}日 ${this.week[this.date.getDay()]}`
    }
  },
  created () {
    this.date = new Date()
  },
  methods: {
    onConfirm (date) {
      this.show = false
      this.date = date
    }
  }
}
</script>

<style lang="less">
.titleStyle{
  text-align: left;
}
.van-icon-arrow::before {
    margin-top: 4px;
}
</style>
