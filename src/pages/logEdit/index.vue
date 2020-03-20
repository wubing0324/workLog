<template>
  <div class="logEdit">
    <van-cell title="日期" :value="formatDate" title-style="text-align: left;" @click="show = true" is-link :border="false" />

    <van-field
      v-model="content"
      rows="2"
      autosize
      maxlength="300"
      type="textarea"
      placeholder="请输入工作内容"
      show-word-limit
      :border="false"
    />
    <van-field
      type="number"
      class="floatStyle"
      v-model="workUseTime"
      label="小时"
      :formatter="formatter"
      placeholder="投入时间"
      :border="false"
    />
    <van-button class="btn" type="info" block :loading="loading" loading-text="保存中..." @click="saveOrUpdateUserWorkLog">修改并保存</van-button>
    <van-calendar v-model="show" color="#2288EE" :default-date="workDate" :show-confirm="false" @confirm="onConfirm" :min-date="minDate" :max-date="maxDate" />
  </div>
</template>

<script>
import day from 'dayjs'
import { saveOrUpdateUserWorkLog, queryUserWorkLogSum } from '../../apis/loglist.js'
import { Notify } from 'vant'

export default {
  name: 'logEdit',
  data () {
    return {
      workUseTime: '',
      content: '',
      workDate: '',
      formatDate: '',
      loading: false,
      minDate: '',
      maxDate: '',
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
  created () {
    let editInfo = localStorage.getItem('editInfo') || {}
    editInfo = this.$route.params.info ? this.$route.params : JSON.parse(editInfo)
    const { defaultDate, formatDate, info } = editInfo
    this.workDate = new Date(defaultDate)
    this.workUseTime = info.workUseTime
    this.content = info.content
    this.uuid = info.uuid
    this.formatDate = formatDate
    this.minDate = new Date(day().subtract(6, 'day'))
    this.maxDate = new Date(day().add(1, 'year'))
    let info1 = localStorage.getItem('info') || {}
    this.info = JSON.parse(info1)
    window.C3.ready(function () {
      window.C3.rightNavKeyItem({})
    })
  },
  methods: {
    onConfirm (date) {
      this.show = false
      this.workDate = date
      console.log(date)
      this.formatDate = this.formatterDate(date)
    },
    formatterDate (workDate) {
      let month = workDate.getMonth() + 1
      month = month > 9 ? month : '0' + month
      let day = workDate.getDate()
      day = day > 9 ? day : '0' + day
      return `${month}月${day}日 ${this.week[workDate.getDay()]}`
    },
    formatter (value) {
      // 过滤输入的数字
      let arr = []
      if (value.indexOf('.') > -1) {
        arr = value.split('.')
        if (arr[1].length > 1) {
          arr[1] = arr[1][0]
          value = arr.join('.')
          Notify({ type: 'danger', message: `只能是一位小数` })
        }
      }
      return value
    },
    async saveOrUpdateUserWorkLog () {
      const { workDate, workUseTime, content, uuid } = this
      let params = {
        workDate: day(workDate).format('YYYY-MM-DD'),
        workUseTime: parseFloat(workUseTime),
        content,
        uuid
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
      this.loading = true
      await saveOrUpdateUserWorkLog({...params, ...this.info})
      this.loading = false
      localStorage.setItem('editInfo', JSON.stringify(this.$route.params))
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
        this.summary = summary - parseInt(this.workUseTime)
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
.van-cell__value{
  font-size: .16rem;
}
.logEdit{
  height: 100vh;
  background: #f2f3f5;
  overflow: hidden;
  .van-cell{
    margin: 10px auto;
  }
  .titleStyle, .van-cell__title{
    text-align: left;
  }
  .van-popup{
    .van-icon-cross{
      display:none;
    }
  }
  .van-icon-arrow::before {
      margin-top: 4px;
  }
  .floatStyle{
    display: block;
    .van-cell__title{
      float: right;
      text-align: right;
      width: 38px;
    }
    .van-cell__value{
      float: left;
      width: 250px;
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
