<template>
  <div class="logDetail">
  <div class="btnBox">
    <van-button class="left" type="default" icon="arrow-left" @click="changeDay('prev')"></van-button>
    <van-button type="default" @click="goLogList">{{ formatDate }}</van-button>
    <van-button class="right" type="default" icon="arrow" @click="changeDay('next')"></van-button>
  </div>
    <van-loading v-show="loading" size="24px">加载中...</van-loading>
    <div class="imgBox" v-if="logData.length === 0 && !loading">
      <img src="../../assets/not-found.png">
      <p>还没有记录日志</p>
    </div>
    <ul v-else class="dataBox">
      <li v-for="(item, index) in logData" :key="index" @click="goLogEditOrView(item)">
        <p class="title"><span>工作时间：</span><span>{{ item.workUseTime }}小时</span>
          <van-button v-show="isEditable" class="editBtn" type="default">修改</van-button>
          <van-button v-show="!isEditable" class="editBtn" type="default">查看</van-button>
        </p>
        <p class="content"><span>工作内容：</span> <span>{{ item.content }}</span></p>
      </li>
    </ul>
    <van-button class="btn" type="info" block @click="logCreate">新建日志</van-button>
  </div>
</template>

<script>
import day from 'dayjs'
import { queryOneDayWorkLogList } from '../../apis/loglist.js'

function debounce (handle, duration) {
  duration = duration || 500
  let timer = null
  function newHandle (data) {
    var self = this
    clearTimeout(timer)
    timer = setTimeout(function () {
      handle.apply(self, [data])
    }, duration)
  }
  return newHandle
}

export default {
  name: 'logDetail',
  data () {
    return {
      day: day,
      date: day(),
      isEditable: true,
      dateSub7: '',
      week: {
        0: '周日',
        1: '周一',
        2: '周二',
        3: '周三',
        4: '周四',
        5: '周五',
        6: '周六'
      },
      logData: [],
      loading: true,
      filter: {
        searchDate: '',
        userCenterId: ''
      }
    }
  },
  computed: {
    formatDate () {
      return `${this.date.format('YYYY年MM月DD')} ${this.week[this.date.format('d')]}`
    }
  },
  created () {
    console.log(this.$route.params)
    this.getData = debounce(this.queryOneDayWorkLogList, 300)
    this.dateSub7 = day(this.date).subtract(7, 'day').unix()
    this.isEditable = this.date.unix() > this.dateSub7
    const { workDate } = this.$route.params
    let info = localStorage.getItem('info') || {}
    this.info = JSON.parse(info)
    this.filter.searchDate = day(workDate).format('YYYY-MM-DD')
    this.date = day(workDate)
    this.filter.userCenterId = this.info.userCenterId
    this.getData(this.filter)
  },
  methods: {
    changeDay (type) {
      if (type === 'prev') {
        this.date = day(this.date).subtract(1, 'day')
      } else {
        this.date = day(this.date).add(1, 'day')
      }
      this.isEditable = this.date.unix() > this.dateSub7
      this.filter.searchDate = this.date.format('YYYY-MM-DD')
      this.getData(this.filter)
    },
    goLogList () {
      this.$router.push({ name: 'logList', params: { defaultDate: new Date(this.date) } })
    },
    goLogEditOrView (info) {
      let name
      if (this.isEditable) {
        name = 'logEdit'
      } else {
        name = 'logView'
      }
      this.$router.push({ name: name, params: { defaultDate: this.date, formatDate: this.formatDate, info, id: info.id } })
    },
    logCreate () {
      this.$router.push({ name: 'logCreate', params: { defaultDate: this.date, formatDate: this.formatDate } })
    },
    async queryOneDayWorkLogList (data) {
      this.loading = true
      let res = await queryOneDayWorkLogList(data)
      this.logData = res.data
      this.loading = false
      console.log(res)
    }
  }
}
</script>

<style lang="less">
.logDetail{
  overflow: hidden;
  button{
    border: 0;
    background: transparent;
  }
  .dataBox{
    width: 3.43rem;
    height: calc(~'100vh - 1.2rem');
    margin: 0 auto;
    overflow: auto;
    li{
      box-sizing: border-box;
      width: 3.43rem;
      height: .98rem;
      background: #F2F3F5;
      border-radius: 3px;
      padding: 0 16px;
      margin-bottom: 10px;
      overflow: hidden;
      p{
        font-family: PingFangSC-Regular;
        color: #666666;
        text-align: left;
        margin: 0 auto;
        &.title{
          height: .22rem;
          font-size: .16rem;
          color: #191919;
          margin: .16rem 0 0.08rem 0;
          .editBtn{
            font-size: .14rem;
            color: #2288EE;
            float: right;
            height: .22rem;
            line-height: .22rem;
          }
        }
        &.content{
          font-size: .14rem;
          color: #666666;
          text-align: left;
          line-height: .18rem;
        }
      }
    }
  }
  .btnBox{
    height: .44rem;
    overflow: hidden;
    display: flex;
    justify-content: center;
    margin-bottom: .1rem;
    button{
      height: .44rem;
    }
    .van-icon-arrow::before {
      margin-top: 0;
    }
    .van-icon-arrow, .van-icon-arrow-left{
      color: #b2b2b2;
    }
    .left{
      &:active{
        .van-icon-arrow-left{
          color: #1F7CD9;
        }
      }
    }
    .right{
      &:active{
        .van-icon-arrow{
          color: #1F7CD9;
        }
      }
    }
  }
  .btn{
    position: absolute;
    bottom: 0.1rem;
    left: 50%;
    transform: translateX(-50%);
    background: #2288EE;
    border-radius: 3px;
    width: 3.35rem;
    height: .44rem;
    margin: 0 auto;
    font-family: PingFangSC-Regular;
    font-size: .16rem;
    color: #FFFFFF;
    letter-spacing: 0;
    line-height: .16rem;
    &:hover{
      background: #1F7CD9;
    }
  }
  .imgBox{
    text-align: center;
    margin: 80px auto 0;
    p{
      font-size: .14rem;
      color: #666666;
    }
  }
}
</style>
