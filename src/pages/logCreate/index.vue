<template>
  <div class="logCreate">
    <van-cell title="日期" :value="formatDate" title-style="text-align: left;" @click="show = true" is-link />
    <van-calendar v-model="show" :default-date="workDate" :show-confirm="false" @confirm="onConfirm" :min-date="minDate" :max-date="maxDate" />

    <van-field
      v-model="content"
      rows="2"
      autosize
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
    <van-button class="btn" type="info" block @click="saveOrUpdateUserWorkLog">保存</van-button>
  </div>
</template>

<script>
import day from 'dayjs'
import { saveOrUpdateUserWorkLog } from '../../apis/loglist.js'

export default {
  name: 'logCreate',
  data () {
    return {
      workDate: '',
      workUseTime: '',
      show: false,
      minDate: '',
      maxDate: '',
      content: '',
      week: {
        0: '周日',
        1: '周一',
        2: '周二',
        3: '周三',
        4: '周四',
        5: '周五',
        6: '周六'
      },
      info: ''
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
    this.minDate = new Date(day().subtract(1, 'year'))
    this.maxDate = new Date(day().add(1, 'year'))
    this.workDate = new Date()
    let info = localStorage.getItem('info') || {}
    this.info = JSON.parse(info)
  },
  methods: {
    onConfirm (date) {
      this.show = false
      this.workDate = date
    },
    formatter (value) {
      // 过滤输入的数字
      return value.replace(/[^0-9]/g, '')
    },
    async saveOrUpdateUserWorkLog () {
      const { workDate, workUseTime, content } = this
      let params = {
        workDate,
        workUseTime,
        content
      }
      await saveOrUpdateUserWorkLog({...params, ...this.info})
      this.$router.push({ name: 'logDetail', params })
    }
  }
}
</script>

<style lang="less">
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
</style>
