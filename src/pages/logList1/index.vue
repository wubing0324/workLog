<template>
<div class="logList1">
    <inlineCalendar @change="handelChange" @switch="handelSwitch">
      <template v-slot:hour="slotProps">
        <span v-show="daysMap[slotProps.time.YYYYMMDD] > 0" class="hourTip">{{ daysMap[slotProps.time.YYYYMMDD] }}</span>
      </template>
    </inlineCalendar>
</div>
</template>

<script>
import inlineCalendar from './inlineCalendar'
import { queryUserWorkLogSum, authUserToken } from '../../apis/loglist'

export default {
  name: 'logList1',
  data () {
    return {
      daysMap: {}
    }
  },
  components: {
    inlineCalendar
  },
  mounted () {
    this.getDays()
    window.C3.setTitle({
      title: '工作日志'
    })
  },
  methods: {
    handelChange (val) {
      this.$emit('change', val)
    },
    handelSwitch (val) {
      this.$emit('switch', val)
    },
    async getDays () {
      authUserToken({'token': localStorage.token}).then((response) => {
        let d = response && response.data
        let data = {
          empNo: d.empNo,
          name: d.nickName,
          userCenterId: d.userId
        }
        localStorage.setItem('info', JSON.stringify(data))
        const p = {
          endDate: '2022/12/31',
          startDate: '2020/01/01',
          userCenterId: data.userCenterId
        }
        queryUserWorkLogSum(p).then((res) => {
          const result = res.data || []
          let daysObj = {}
          result.map(item => {
            daysObj[item.workDate] = item.workUseTime
          })
          this.daysMap = daysObj
        })
      })
    }
  }
}
</script>
<style lang="less">
.logList1{
  .hourTip{
    position: absolute;
    width: 26px;
    height: 13px;
    line-height: 14px;
    text-align: center;
    right: 0;
    top: 0;
    left: unset;
    border-radius: 2px;
    background-color: #2288ee;
    color: #fff;
    font-size: 12px;
  }
}
</style>
