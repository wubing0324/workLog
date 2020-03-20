<template>
  <div class="toProject">
    <div>
      <van-search v-model="searchValue" show-action maxlength="40" @input='searchItem' @cancel="onCancel" placeholder="搜索项目" />
    </div>
    <ul v-if='newDatalist.length !== 0' style="width: 100%;height:100%;position:absolute;top:40px;" @click="selectProject">
      <li class="van-hairline--bottom" v-for="(item, index) in newDatalist" :data-src='index' :key='item.projectId'>{{item.projectName}}</li>
    </ul>
    <div class="imgBox" v-if="newDatalist.length === 0 && searchValue !== ''">
      <img src="../assets/not-found.png">
      <div style="margin-top:15px">找不到项目</div>
    </div>
    <div v-if="newDatalist.length === 0 && searchValue === ''">
      <p>最近选择的项目</p>
      <ul @click="selectProject1">
        <li class="van-hairline--bottom" v-for="(item, index) in always" :data-src='index' :key='item.projectId'>{{item.projectName}}</li>
      </ul>
      <p>全部项目</p>
      <ul @click="selectProject">
        <li class="van-hairline--bottom" v-for="(item, index) in dataList" :data-src='index' :key='item.projectId'>{{item.projectName}}</li>
      </ul>
    </div>
  </div>
</template>

<script>

export default {
  name: 'toProject',
  props: {
    dataList: {
      type: Array,
      default: () => []
    },
    always: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      searchValue: '',
      newDatalist: []
    }
  },
  created () {
  },
  methods: {
    // 搜索
    searchItem () {
      let filter = this.searchValue.toUpperCase()
      let data = this.dataList
      let newList = []
      if (this.searchValue !== '') {
        for (var i = 0; i < data.length; i++) {
          if (data[i].projectName.toUpperCase().indexOf(filter) > -1) {
            newList.push(data[i])
          }
        }
      }
      this.newDatalist = newList
    },
    // 取消搜索
    onCancel () {
    },
    selectProject (e) {
      let index = e.target.getAttribute('data-src')
      this.$emit('selectProject', this.dataList[index])
    },
    selectProject1 (e) {
      let index = e.target.getAttribute('data-src')
      this.$emit('selectProject', this.always[index])
    }
  }
}
</script>

<style lang="less">
.toProject{
  height: 100vh;
  width: 100%;
  overflow-y: auto;
  // background: #f2f3f5;
  background: #FFFFFF;
  text-align: left;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  .van-search .van-cell{
    margin: 0;
  }
  p{
    font-size: .14rem;
    color: #666;
    height: .32rem;
    line-height: .32rem;
    background: #F2F3F5;
    margin: 0;
    padding: 0 .16rem;
  }
  ul{
    li{
      padding: 0 .16rem;
      height: .44rem;
      line-height: .44rem;
      font-size: .16rem;
      color: #191919;
      background: #fff;
      &:hover, &:active{
        background: #E5E5E5;
      }
    }
  }
  .imgBox{
    text-align: center;
    margin: 80px auto 0;
    font-size: 14px;
    color: #666666;
  }
}
</style>
