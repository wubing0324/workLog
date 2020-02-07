<template>
  <div class="logList">
    <van-calendar
      ref="calender"
      class="list-calendar"
      title="日历"
      :min-date="minDate"
      :poppable="false"
      :show-confirm="false"
      :style="{ height: '100vh' }"
      :formatter="formatter"
      :default-date="defaultDate"
      @confirm="onConfirm"
    />
    <div class="footer-wrapper">
      <div class="tip">温馨提示：只能修改最近7天的工作日志哦!</div>
      <van-button type="primary" @click="logCreate" block>新建日志</van-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'logList',
  data () {
    return {
      minDate: new Date(2020, 0, 1),
      defaultDate: new Date()
      // maxDate: new Date()
    }
  },
  methods: {
    logCreate () {
      alert('create')
    },
    formatter (day) {
      day.topInfo = '1'
      return day
    },
    formatDate (date) {
      return `${date.getMonth() + 1}/${date.getDate()}`
    },
    onConfirm (date) {
      this.date = this.formatDate(date)
    },
    logCreate () {
      this.$router.push({ name: 'logCreate', params: { defaultDate: this.date } })
    }
  },
  mounted () {
    window.C3.setTitle({
      title: '工时日志'
    })
    const defaultDate = this.$route.params.defaultDate || new Date()
    this.defaultDate = defaultDate
    this.$refs.calender.scrollIntoView()
  }
}
</script>

<style lang="less">
.logList {
  position: relative;

  .footer-wrapper {
    position: fixed;
    bottom: 0;
    width: 100%;
    background: #fff;

    .tip {
      color: #9b9b9b;
    }
  }
}
.van-calendar.list-calendar {
  position: relative;

  .van-calendar__top-info {
    position: absolute;
    width: 18px;
    height: 18px;
    line-height: 18px;
    text-align: center;
    right: 4px;
    top: 8px;
    left: unset;
    border-radius: 50%;
    background-color: #2288ee;
    color: #fff;
  }

  .van-calendar__selected-day {
    background-color: #DEEDFD;
    color: #2c3e50;
  }
}
</style>
