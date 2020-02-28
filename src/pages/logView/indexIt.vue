<template>
  <div class="logDetail">
    <p class="title">{{ formatDate }}</p>
    <div v-if="projectType === 1" >
      <p class="tip">非项目</p>
      <p class="content">{{ unProject.unprojectName }}</p>
    </div>
    <div v-else>
      <p class="tip">项目</p>
      <p class="content">{{ project.projectName }}</p>
      <p class="tip">经营体</p>
      <p class="content">{{ project.manageBody }}</p>
      <p class="tip">工作类型</p>
      <p class="content">{{ workType.workTypeName }}</p>
      <p class="tip">工作类别</p>
      <p class="content">{{ category.workClassName }}</p>
    </div>
    <p class="tip">工作时间</p>
    <p class="content">{{ workUseTime }}小时</p>
    <p class="tip">工作内容:</p>
    <p class="content">{{ content }}</p>
  </div>
</template>

<script>
import { getUserWorkLogInitData, queryUserWorkLogItByUuid } from '../../apis/loglist.js'
export default {
  name: 'logEdit',
  data () {
    return {
      valueKey: 'workTypeName',
      showProject: false,
      unProject: {
        unprojectName: ''
      },
      project: {
        projectName: '',
        manageBody: ''
      },
      category: {
        workClassName: ''
      },
      columns: [],
      type: '',
      userWorkLogUnprojectList: [],
      userWorkLogProjectList: [],
      userWorkLogClassList: [],
      userWorkLogTypeList: [],
      workDate: '',
      showPicker: false,
      workType: {
        workTypeName: ''
      },
      projectType: 0,
      show: false,
      workUseTime: '',
      content: '',
      loading: false,
      formatDate: '',
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
    let info1 = localStorage.getItem('info') || {}
    this.info = JSON.parse(info1)
    this.uuid = this.$route.params.id
    this.getDays()
  },
  methods: {
    formatterDate (workDate) {
      let month = workDate.getMonth() + 1
      month = month > 9 ? month : '0' + month
      let day = workDate.getDate()
      day = day > 9 ? day : '0' + day
      return `${month}月${day}日 ${this.week[workDate.getDay()]}`
    },
    async getDays () {
      const data = {
        uuid: this.$route.params.id,
        token: 'fda6ec9a-deda-4436-9e00-c7693144decf'
      }
      try {
        queryUserWorkLogItByUuid(data).then((response) => {
          const result = response.data || []
          this.project.projectId = result.projectId
          this.projectType = Number(result.projectType)
          this.category.workClassId = result.workClassId
          this.workType.workTypeId = result.workTypeId
          this.unProject.unprojectId = result.unprojectId
          this.workDate = new Date(result.workDate)
          this.formatDate = this.formatterDate(this.workDate)
          getUserWorkLogInitData({}).then((res) => {
            this.userWorkLogTypeList = res.data.userWorkLogTypeList
            this.userWorkLogClassList = res.data.userWorkLogClassList
            this.userWorkLogProjectList = res.data.userWorkLogProjectList
            this.userWorkLogUnprojectList = res.data.userWorkLogUnprojectList
            this.workUseTime = result.workUseTime
            this.content = result.content
            if (this.projectType === 0) {
              this.userWorkLogTypeList.forEach((item) => {
                if (item.workTypeId === this.workType.workTypeId) {
                  this.workType.workTypeName = item.workTypeName
                }
              })
              this.userWorkLogClassList.forEach((item) => {
                if (item.workClassId === this.category.workClassId) {
                  this.category.workClassName = item.workClassName
                }
              })
              this.userWorkLogProjectList.forEach((item) => {
                if (item.projectId === this.project.projectId) {
                  this.project.projectName = item.projectName
                  this.project.manageBody = item.manageBody
                }
              })
            } else {
              this.userWorkLogUnprojectList.forEach((item) => {
                if (item.unprojectId === this.unProject.unprojectId) {
                  this.unProject.unprojectName = item.unprojectName
                }
              })
            }
          })
        })
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="less">
.logDetail{
  padding: 0 .13rem 0 .16rem;
  .tagsBox{
    height: 1.90rem;
    width: 100%;
    background: #fff;
    overflow-y: auto;
    overflow-x: hidden;
    ul{
      padding: .16rem;
      width: 3.85rem;
      li{
        width: 1.07rem;
        height: .32rem;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        background: #F2F3F5;
        border-radius: 2px;
        line-height: .32rem;
        text-align: center;
        font-size: .14rem;
        color: #191919;
        float: left;
        margin: 0 .1rem .1rem 0;
        &:hover, &:active{
          background: #2288EE;
          color: #fff;
        }
      }
      .isActive{
        background: #2288EE;
        color: #fff;
      }
    }
  }
  .title{
    font-size: .16rem;
    color: #191919;
    text-align: center;
    margin: 0.1rem 0 7px 0;
  }
  .tip{
    font-size: .14rem;
    color: #666666;
    text-align: left;
    margin: .2rem 0 0.04rem 0;
  }
  .content{
    font-size: .16rem;
    color: #191919;
    text-align: left;
    margin: .04rem 0 0.2rem 0;
  }
}
</style>
