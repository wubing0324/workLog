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
        <p class="content">工作内容：{{ item.content }}</p>
      </li>
    </ul>
    <van-button class="btn" v-show="isEditable" type="info" block @click="logCreate">新建日志</van-button>
    <van-popup
      v-model="show"
      position="bottom"
      :style="{ height: '35%' }"
    >
      <p class="tmpTitle">选择日志模板</p>
    <div class="btnBox1">
      <div class="btnTm" v-for="item in tmpList" :key="item.templateName">
        <img :src="'./static/0' + item.type + '.svg'" @click="goTemplate(item.type)" alt="" srcset="">
        <p>{{item.templateName}}</p>
      </div>
    </div>
    <van-button @click="closeOverly" class="cancleBtn" type="default">取消</van-button>
    </van-popup>
  </div>
</template>

<script>
import day from 'dayjs'
import { queryOneDayWorkLogList, getUserWorkLogTemplateList } from '../../apis/loglist.js'

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
      show: false,
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
      },
      logType: {
        0: '',
        1: 'It'
      },
      tmpList: []
    }
  },
  computed: {
    formatDate () {
      return `${this.date.format('YYYY年MM月DD日')} ${this.week[this.date.format('d')]}`
    }
  },
  created () {
    this.getData = debounce(this.queryOneDayWorkLogList, 300)
    this.dateSub7 = day().subtract(7, 'day').unix()
    const { workDate } = this.$route.params
    let info = localStorage.getItem('info') || {}
    this.info = JSON.parse(info)
    if (workDate) {
      this.date = day(workDate)
      this.filter.searchDate = day(workDate).format('YYYY-MM-DD')
    } else {
      let time = JSON.parse(localStorage.getItem('detailTime'))
      this.date = day(time)
      this.filter.searchDate = this.date.format('YYYY-MM-DD')
    }
    this.isEditable = this.date.unix() > this.dateSub7
    this.filter.userCenterId = this.info.userCenterId
    getUserWorkLogTemplateList({userCenterId: this.info.userCenterId}).then((res) => {
      this.tmpList = res.data
    })
    this.getData(this.filter)
  },
  methods: {
    closeOverly () {
      this.show = false
    },
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
      this.$router.push({ name: name + this.logType[info.logType], params: { defaultDate: this.date, formatDate: this.formatDate, info, id: info.uuid } })
    },
    goTemplate (type) {
      this.$router.push({ name: 'logCreate' + this.logType[type], params: { defaultDate: this.date, formatDate: this.formatDate } })
    },
    logCreate () {
      if (this.tmpList.length > 1) {
        this.show = true
      } else {
        this.$router.push({ name: 'logCreate' + this.logType[this.tmpList[0].type], params: { defaultDate: this.date } })
      }
    },
    async queryOneDayWorkLogList (data) {
      this.loading = true
      let res = await queryOneDayWorkLogList(data)
      localStorage.setItem('detailTime', JSON.stringify(data.searchDate))
      this.logData = res.data
      this.loading = false
    }
  }
}
</script>

<style lang="less">
.logDetail{
  overflow: hidden;
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
    border: 1px solid #ebedf0;
  }
  .tmpTitle{
    font-size: .16rem;
    color: #323233;
    text-align: center;
    margin: .24rem auto;
  }
  .btnBox1{
    width: 1.85rem;
    height: 1.02rem;
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
      &:hover, &:active{
        background: #E5E5E5;
      }
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
            padding-right:0;
          }
        }
        &.content{
          font-size: .14rem;
          color: #666666;
          text-align: left;
          line-height: .18rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }
    }
  }
  .btnBox{
    height: .44rem;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    margin-bottom: .1rem;
    button{
      height: .44rem;
    }
    .van-button__text{
      font-size:.16rem;
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
