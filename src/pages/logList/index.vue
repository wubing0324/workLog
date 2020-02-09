<template>
  <div class="logList">
    <van-calendar
      ref="calender"
      class="list-calendar"
      title="日历"
      :min-date="minDate"
      :max-date="maxDate"
      :poppable="false"
      :show-confirm="false"
      :style="{ height: '100vh' }"
      :formatter="formatter"
      :default-date="defaultDate"
      @confirm="onConfirm"
    >
      <div class="footer-wrapper" slot="footer">
        <div class="tip">温馨提示：只能修改最近7天的工作日志哦!</div>
        <van-button class="create-button" type="info" @click="logCreate">新建日志</van-button>
      </div>
    </van-calendar>
  </div>
</template>

<script>
import day from 'dayjs'
import { queryUserWorkLogSum } from '../../apis/loglist'
export default {
  name: 'logList',
  data () {
    return {
      minDate: new Date(2020, 0, 1),
      defaultDate: new Date(),
      maxDate: new Date(day().add(2, 'year')),
      daysMap: {}
    }
  },
  methods: {
    formatter (time) {
      let date = day(time.date).format('YYYY-MM-DD')
      let hours = this.daysMap[date]
      if (hours) {
        time.topInfo = hours
      }
      return time
    },
    onConfirm (date) {
      let time = day(date).format('YYYY-MM-DD')
      let workUseTime = this.daysMap[time]
      let params = {
        workDate: date,
        workUseTime
      }
      this.$router.push({ name: 'logDetail', params })
    },
    logCreate () {
      this.$router.push({ name: 'logCreate', params: { defaultDate: new Date() } })
    },
    async getDays () {
      let info = JSON.parse(localStorage.info)
      const data = {
        endDate: '2022/12/31',
        startDate: '2020/01/01',
        userCenterId: info.userCenterId
      }
      try {
        const response = await queryUserWorkLogSum(data)
        const result = response.data || []
        let daysObj = {}
        result.map(item => {
          daysObj[item.workDate] = item.workUseTime
        })
        this.daysMap = daysObj
        this.$nextTick(() => {
          this.$refs.calender.scrollIntoView()
        })
      } catch (e) {
        console.log(e)
      }
    }
  },
  mounted () {
    this.getDays()
    window.C3.setTitle({
      title: '工时日志'
    })
    const defaultDate = this.$route.params.defaultDate || new Date()
    this.defaultDate = defaultDate
    this.$nextTick(() => {
      this.$refs.calender.scrollIntoView()
    })
  }
}
</script>

<style lang="less">
.logList {
  position: relative;

  .van-calendar__header-title {
    display: none;
  }

  .footer-wrapper {
    width: 100%;
    background: #fff;
    padding: 10px 0;
    font-size: .14px;

    .tip {
      color: #9b9b9b;
      margin-bottom: 5px;
      font-size: .14rem;
    }

    .create-button {
      font-size: 16px;
      width: calc(100vw - 40px);
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
