<template>
  <div class="logEdit">
    <van-cell title="日期" :value="workDate" title-style="text-align: left;" />

    <van-field
      v-model="content"
      rows="2"
      autosize
      type="textarea"
      placeholder="请输入工作内容"
    />
    <van-field
      class="floatStyle"
      v-model="workUseTime"
      label="小时"
      :formatter="formatter"
      placeholder="投入时间"
    />
    <van-button class="btn" type="info" block @click="saveOrUpdateUserWorkLog">修改并保存</van-button>
  </div>
</template>

<script>
import { saveOrUpdateUserWorkLog } from '../../apis/loglist.js'

export default {
  name: 'logEdit',
  data () {
    return {
      workUseTime: '',
      content: '',
      workDate: ''
    }
  },
  created () {
    const { defaultDate, info } = this.$route.params
    this.workUseTime = info.workUseTime
    this.content = info.content
    this.workDate = defaultDate
    let info1 = localStorage.getItem('info') || {}
    this.info = JSON.parse(info1)
  },
  methods: {
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
