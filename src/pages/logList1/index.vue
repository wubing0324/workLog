<template>
<div class="logList1">
    <inlineCalendar @change="handelChange" @switch="handelSwitch" :defaultDate="defaultDate" :minDate="minDate">
      <template v-slot:hour="slotProps">
        <span v-show="daysMap[slotProps.time.YYYYMMDD] > 0" class="hourTip">{{ daysMap[slotProps.time.YYYYMMDD] }}</span>
      </template>
    </inlineCalendar>
    <div class="footer-wrapper">
      <div class="tip">温馨提示：只能修改最近7天的工作日志哦!</div>
      <van-button class="create-button" type="info" @click="logCreate">新建日志</van-button>
    </div>
    <van-popup
      v-model="show"
      position="bottom"
      :style="{ height: '35%' }"
    >
    <p class="tmpTitle">选择日志模板</p>
    <div class="btnBox1">
      <div class="btnTm">
        <img src="../../assets/01.svg" @click="goTemplate('')" alt="" srcset="">
        <p>通用模板</p>
      </div>
      <div class="btnTm">
        <img src="../../assets/02.svg" @click="goTemplate('It')" alt="" srcset="">
        <p>IT模板</p>
      </div>
    </div>
    <van-button @click="closeOverly" class="cancleBtn" type="default">取消</van-button>
    </van-popup>
</div>
</template>

<script>
import day from 'dayjs'
import inlineCalendar from './inlineCalendar'
import { queryUserWorkLogSum, authUserToken } from '../../apis/loglist'

export default {
  name: 'logList1',
  data () {
    return {
      minDate: new Date(2020, 0, 1),
      defaultDate: null,
      maxDate: new Date(day().add(2, 'year')),
      daysMap: {},
      show: false
    }
  },
  components: {
    inlineCalendar
  },
  created () {
    this.defaultDate = this.$route.params.defaultDate || new Date()
  },
  mounted () {
    this.getDays()
    window.C3.setTitle({
      title: '工作日志'
    })
  },
  methods: {
    closeOverly () {
      this.show = false
    },
    goTemplate (type) {
      this.$router.push({ name: 'logCreate' + type, params: { defaultDate: new Date() } })
    },
    logCreate () {
      this.show = true
      // this.$router.push({ name: 'logCreate', params: { defaultDate: new Date() } })
    },
    handelChange (date) {
      let time = day(date).format('YYYY-MM-DD')
      let workUseTime = this.daysMap[time]
      let params = {
        workDate: date,
        workUseTime
      }
      this.$router.push({ name: 'logDetail', params })
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
  .cancleBtn{
    width: 100%;
    height: .44rem;
    position: absolute;
    bottom: 0;
    left: 0;
    background: #FFFFFF;
    box-shadow: inset 0 0 0 0 #DEDEDE;
    font-size: .17rem;
    color: #323233;
  }
  .tmpTitle{
    font-size: .16rem;
    color: #323233;
    text-align: center;
    margin: .24rem auto;
  }
  .btnBox1{
    width: 1.85rem;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    .btnTm{
      height: 1.02rem;
      img{
        display: block;
        width: .46rem;
        height: .56rem;
        margin: 0 auto;
      }
      p{
        font-size: .12rem;
        color: #666666;
        line-height: .18rem;
        margin: .04rem auto;
        text-align: center;
      }
    }
  }
  .hourTip{
    position: absolute;
    width: .27rem;
    height: .13rem;
    line-height: .15rem;
    text-align: center;
    right: 0;
    top: 0;
    left: unset;
    border-radius: 2px;
    background-color: #2288ee;
    color: #fff;
    font-size: .12rem;
  }

  .van-calendar__header-title {
    display: none;
  }

  .footer-wrapper {
    position: absolute;
    bottom: 0;
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
</style>
