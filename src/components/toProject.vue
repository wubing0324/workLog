<template>
  <div class="toProject">
    <p>最近选择的项目</p>
    <ul @click="selectProject1">
      <li class="van-hairline--bottom" v-for="(item, index) in always" :data-src='index' :key='item.projectId'>{{item.projectName}}</li>
    </ul>
    <p>全部项目</p>
    <ul @click="selectProject">
      <li class="van-hairline--bottom" v-for="(item, index) in dataList" :data-src='index' :key='item.projectId'>{{item.projectName}}</li>
    </ul>
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
    }
  },
  created () {
  },
  methods: {
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
  background: #f2f3f5;
  text-align: left;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
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
}
</style>
