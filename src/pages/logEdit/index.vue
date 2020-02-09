<template>
  <div class="logEdit">
    <van-cell title="日期" :value="formatDate" title-style="text-align: left;" :border="false" />

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
      class="floatStyle"
      v-model="workUseTime"
      label="小时"
      :formatter="formatter"
      placeholder="投入时间"
      :border="false"
    />
    <van-button class="btn" type="info" block :loading="loading" loading-text="保存中..." @click="saveOrUpdateUserWorkLog">修改并保存</van-button>
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
      loading: false
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
    let info1 = localStorage.getItem('info') || {}
    this.info = JSON.parse(info1)
  },
  methods: {
    formatter (value) {
      // 过滤输入的数字
      return value.replace(/[^0-9]/g, '')
    },
    async saveOrUpdateUserWorkLog () {
      const { workDate, workUseTime, content, uuid } = this
      let params = {
        workDate: day(workDate).format('YYYY-MM-DD'),
        workUseTime,
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
