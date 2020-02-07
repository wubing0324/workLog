<template>
  <div class="logDetail">
  <div class="btnBox">
    <van-button type="default" @click="changeDay('prev')">前一天</van-button>
    <van-button type="default" @click="goLogList">{{ formatDate }}</van-button>
    <van-button type="default" @click="changeDay('next')">后一天</van-button>
  </div>
    <van-loading v-show="loading" size="24px">加载中...</van-loading>
    <div class="imgBox" v-show="logData.length === 0 && !loading">
      <img src="../../assets/not-found.png">
      <p>还没有记录日志</p>
    </div>
    <ul class="dataBox">
      <li v-for="(item, index) in logData" :key="index" @click="goLogEdit(item)">
        <p><span>工作时间：</span><span>{{ item.hour }}</span><van-button type="default">修改</van-button></p>
        <p><span>工作内容：</span> <span>{{ item.content }}</span></p>
      </li>
    </ul>
    <van-button class="btn" type="info" block @click="logCreate">新建日志</van-button>
  </div>
</template>

<script>
import day from 'dayjs'

export default {
  name: 'logDetail',
  data () {
    return {
      day: day,
      date: day(),
      week: {
        0: '周日',
        1: '周一',
        2: '周二',
        3: '周三',
        4: '周四',
        5: '周五',
        6: '周六'
      },
      logData: [
        {
          hour: '3小时',
          content: '好多好多话好多好多话好多话好多话时间的思考军事基地'
        },
        {
          hour: '3小时',
          content: '好多好多话好多好多话好多话好多话时间的思考军事基地'
        },
        {
          hour: '3小时',
          content: '好多好多话好多好多话好多话好多话时间的思考军事基地'
        },
        {
          hour: '3小时',
          content: '好多好多话好多好多话好多话好多话时间的思考军事基地'
        },
        {
          hour: '3小时',
          content: '好多好多话好多好多话好多话好多话时间的思考军事基地'
        },
        {
          hour: '3小时',
          content: '好多好多话好多好多话好多话好多话时间的思考军事基地'
        }
      ],
      loading: true
    }
  },
  computed: {
    formatDate () {
      return `${this.date.format('YYYY年MM月DD')} ${this.week[this.date.format('d')]}`
    }
  },
  created () {
    this.getLogData()
  },
  methods: {
    changeDay (type) {
      if (type === 'prev') {
        this.date = day(this.date).subtract(1, 'day')
      } else {
        this.date = day(this.date).add(1, 'day')
      }
    },
    goLogList () {
      this.$router.push({ name: 'logList', params: { defaultDate: new Date(this.date) } })
    },
    goLogEdit () {
      this.$router.push({ name: 'logEdit', params: { defaultDate: this.date } })
    },
    logCreate () {
      this.$router.push({ name: 'logCreate', params: { defaultDate: this.date } })
    },
    getLogData () {
      setTimeout(() => {
        this.loading = false
      }, 3000)
    }
  }
}
</script>

<style lang="less">
.logDetail{
  overflow: hidden;
  button{
    height: .44rem;
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
      p{
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #666666;
        text-align: left;
        line-height: 18px;
        margin: 0 auto;
      }
    }
  }
  .btnBox{
    height: .44rem;
    overflow: hidden;
    display: flex;
    justify-content: center;
    margin-bottom: .1rem;
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
  }
}
</style>
