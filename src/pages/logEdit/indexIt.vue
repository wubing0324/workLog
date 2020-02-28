<template>
  <div class="logEdit">
    <van-tabs @click="onClick" v-model="projectType">
      <van-tab title="项目">
        <van-cell title="日期" :value="formatDate" title-style="text-align: left;" :border="false" />
        <van-cell title="项目" :value="project.projectName" title-style="text-align: left;" @click="toProject" is-link />
        <van-field v-model="project.manageBody" readonly label="经营体" />

        <van-field
          readonly
          clickable
          label="工作类型"
          :value="workType.workTypeName"
          placeholder="请选择工作类型"
          @click="showPickerFn('s')"
        />
        <van-field
          readonly
          clickable
          label="工作类别"
          :value="category.workClassName"
          placeholder="请选择工作类别"
          @click="showPickerFn('b')"
        />
        <van-popup v-model="showPicker" position="bottom">
          <van-picker
            show-toolbar
            :value-key="valueKey"
            :columns="columns"
            @cancel="showPicker = false"
            @confirm="onConfirmWorkTypeOrCategory"
          />
        </van-popup>
      </van-tab>
      <van-tab title="非项目">
        <van-cell title="日期" :value="formatDate" title-style="text-align: left;" :border="false" />
        <div class="tagsBox">
          <ul>
            <li v-for="item in userWorkLogUnprojectList" :class="{isActive: item.unprojectId === unProject.unprojectId}" :key="item.unprojectId" @click="selectTag(item)">{{item.unprojectName}}</li>
          </ul>
        </div>
      </van-tab>
    </van-tabs>

    <van-field
      type="number"
      class="floatStyle"
      v-model="workUseTime"
      label="小时"
      :formatter="formatter"
      placeholder="投入时间"
      :border="false"
    />
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
    <van-button class="btn" type="info" block :loading="loading" loading-text="保存中..." @click="saveOrUpdateUserWorkLog">修改并保存</van-button>
    <to-project v-show="showProject" :dataList="userWorkLogProjectList" :always="always" @selectProject="selectProject"></to-project>
  </div>
</template>

<script>
import day from 'dayjs'
import { getUserWorkLogInitData, queryUserWorkLogSum, saveOrUpdateUserWorkLogIt, queryUserWorkLogItByUuid } from '../../apis/loglist.js'
import { Notify } from 'vant'
import toProject from '../../components/toProject'

export default {
  name: 'logEdit',
  data () {
    return {
      always: [],
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
  components: {
    toProject
  },
  created () {
    let info1 = localStorage.getItem('info') || {}
    this.info = JSON.parse(info1)
    this.uuid = this.$route.params.id
    this.always = localStorage.getItem('always') ? JSON.parse(localStorage.getItem('always')) : []
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
    selectTag (unproject) {
      this.unProject = {...unproject}
    },
    selectProject (project) {
      this.project = {...project}
      this.showProject = false
    },
    toProject () {
      this.showProject = true
    },
    onClick (name, title) {
      this.projectType = name
    },
    showPickerFn (type) {
      this.type = type
      if (type === 's') {
        this.valueKey = 'workTypeName'
        this.columns = this.userWorkLogTypeList
      } else {
        this.valueKey = 'workClassName'
        this.columns = this.userWorkLogClassList
      }
      this.showPicker = true
    },
    onConfirmWorkTypeOrCategory (value) {
      if (this.type === 's') {
        this.workType = value
      } else {
        this.category = value
      }
      this.showPicker = false
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
      let params1 = {}
      if (this.projectType === 0) {
        params1 = {
          logType: 1,
          manageBody: this.project.manageBody,
          projectId: this.project.projectId,
          projectType: this.projectType,
          workClassId: this.category.workClassId,
          workTypeId: this.workType.workTypeId
        }
      } else {
        params1 = {
          logType: 1,
          projectType: this.projectType,
          unprojectId: this.unProject.unprojectId
        }
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
      if (this.projectType === 0) {
        if (!this.project.projectName.trim()) {
          Notify({ type: 'danger', message: '项目不能为空' })
          return
        }
        if (!this.workType.workTypeName.trim()) {
          Notify({ type: 'danger', message: '工作类型不能为空' })
          return
        }
        if (!this.category.workClassName.trim()) {
          Notify({ type: 'danger', message: '工作类别不能为空' })
          return
        }
      }
      if (this.projectType === 1) {
        if (!this.unProject.unprojectName.trim()) {
          Notify({ type: 'danger', message: '类型不能为空' })
          return
        }
      }
      this.loading = true
      await saveOrUpdateUserWorkLogIt({...params1, ...params, ...this.info})
      this.loading = false
      this.always.forEach((obj, index) => {
        if (obj.projectId === this.project.projectId) {
          this.always.splice(index, 1)
        }
      })
      this.always.unshift(this.project)
      if (this.always.length > 8) {
        this.always.pop()
      }
      localStorage.setItem('always', JSON.stringify(this.always))
      localStorage.setItem('editInfo', JSON.stringify(this.$route.params))
      this.$router.push({ name: 'logDetail', params })
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
          this.workUseTime = result.workUseTime
          this.formatDate = this.formatterDate(this.workDate)
          let today = day(this.workDate).format('YYYY-MM-DD')
          const data1 = {
            endDate: today,
            startDate: today,
            userCenterId: this.info.userCenterId
          }
          queryUserWorkLogSum(data1).then((response1) => {
            const result1 = response1.data || []
            this.summary = result1[0].workUseTime - parseInt(this.workUseTime)
          })
          getUserWorkLogInitData({}).then((res) => {
            this.userWorkLogTypeList = res.data.userWorkLogTypeList
            this.userWorkLogClassList = res.data.userWorkLogClassList
            this.userWorkLogProjectList = res.data.userWorkLogProjectList
            this.userWorkLogUnprojectList = res.data.userWorkLogUnprojectList
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
.van-cell__value{
  font-size: .16rem;
}
.logEdit{
  height: 100vh;
  background: #f2f3f5;
  overflow: hidden;
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
