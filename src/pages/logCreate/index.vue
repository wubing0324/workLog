<template>
  <div class="logCreate">
    <van-cell title="日期" :value="formatDate" title-style="text-align: left;" @click="show = true" is-link />
    <van-calendar v-model="show" :default-date="workDate" color="#2288EE" :show-confirm="false" @confirm="onConfirm" :min-date="minDate" :max-date="maxDate" />

    <van-field
      v-model="content"
      rows="2"
      autosize
      maxlength="300"
      type="textarea"
      placeholder="请输入工作内容"
      show-word-limit
    />
    <van-field
      class="floatStyle"
      v-model="workUseTime"
      label="小时"
      :formatter="formatter"
      placeholder="投入时间"
    />
    <van-button class="btn" type="info" :loading="loading" v-show="isEditable" loading-text="保存中..." block @click="saveOrUpdateUserWorkLog">保存</van-button>
  </div>
</template>

<script>
import day from 'dayjs'
import { saveOrUpdateUserWorkLog, queryUserWorkLogSum } from '../../apis/loglist.js'
import { Notify } from 'vant'

export default {
  name: 'logCreate',
  data () {
    return {
      workDate: '',
      workUseTime: '',
      show: false,
      minDate: '',
      minDateUnix: '',
      maxDate: '',
      isEditable: true,
      content: '',
      loading: false,
      week: {
        0: '周日',
        1: '周一',
        2: '周二',
        3: '周三',
        4: '周四',
        5: '周五',
        6: '周六'
      },
      info: '',
      summary: 0
    }
  },
  computed: {
    formatDate () {
      let month = this.workDate.getMonth() + 1
      month = month > 9 ? month : '0' + month
      let day = this.workDate.getDate()
      day = day > 9 ? day : '0' + day
      return `${month}月${day}日 ${this.week[this.workDate.getDay()]}`
    }
  },
  created () {
    const { defaultDate } = this.$route.params
    let time = JSON.parse(localStorage.getItem('createTime'))
    this.minDateUnix = day().subtract(7, 'day').unix()
    console.log(this.minDateUnix)
    this.minDate = new Date(day().subtract(6, 'day'))
    this.maxDate = new Date(day().add(1, 'year'))
    if (defaultDate) {
      this.workDate = new Date(defaultDate)
    } else {
      this.workDate = new Date(time)
    }
    let info = localStorage.getItem('info') || {}
    this.info = JSON.parse(info)
  },
  methods: {
    onConfirm (date) {
      this.show = false
      this.workDate = date
      this.isEditable = this.minDateUnix < day(date).unix()
      console.log(this.isEditable)
    },
    formatter (value) {
      // 过滤输入的数字
      return value.replace(/[^0-9]/g, '')
    },
    async saveOrUpdateUserWorkLog () {
      const { workDate, workUseTime, content } = this
      let params = {
        workDate: day(workDate).format('YYYY-MM-DD'),
        workUseTime,
        content
      }
      if (!content.trim()) {
        Notify({ type: 'danger', message: '内容不能为空' })
        return
      }
      if (!workUseTime || Number(workUseTime) === 0) {
        Notify({ type: 'danger', message: '工时不能为0' })
        return
      }
      if (this.summary + Number(workUseTime) > 24) {
        Notify({ type: 'danger', message: `一天的工时不能超过24小时,当前${this.summary}工时` })
        return
      }
      await saveOrUpdateUserWorkLog({...params, ...this.info})
      this.loading = false
      localStorage.setItem('createTime', JSON.stringify(params.workDate))
      this.$router.push({ name: 'logDetail', params })
    },
    async getDays () {
      let today = day(this.workDate).format('YYYY-MM-DD')
      const data = {
        endDate: today,
        startDate: today,
        userCenterId: this.info.userCenterId
      }
      try {
        const response = await queryUserWorkLogSum(data)
        const result = response.data || []
        let daysObj = {}
        result.map(item => {
          daysObj[item.workDate] = item.workUseTime
        })
        let summary = result.reduce((pre, next) => {
          return pre + next.workUseTime
        }, 0)
        this.summary = summary
      } catch (e) {
        console.log(e)
      }
    }
  },
  mounted () {
    this.getDays()
  }
}
</script>

<style lang="less">
.logCreate{
  height: 100vh;
  background: #f2f3f5;
  overflow: hidden;
  .van-popup{
    .van-icon-cross{
      display:none;
    }
  }
  .van-cell{
    margin: 10px auto;
  }
  .titleStyle, .van-cell__title{
    text-align: left;
  }
  .van-icon-arrow::before {
      margin-top: 4px;
  }
  .floatStyle{
    display: block;
    .van-cell__title{
      float: right;
      text-align: right;
    }
    .van-cell__value{
      float: left;
    }
  }
  .btn{
    background: #2288EE;
    border-radius: 3px;
    width: 335px;
    height: 44px;
    margin: 20px auto;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #FFFFFF;
    letter-spacing: 0;
    line-height: 16px;
    &:hover{
      background: #1F7CD9;
    }
  }
}
</style>
