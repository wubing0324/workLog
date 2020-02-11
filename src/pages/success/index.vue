<template>
  <div class="success-wrapper">
    <div class="info-wrapper">
      <van-icon class="success-icon" name="checked" />
      <p class="text">今日疫情登记，已提交成功</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'success'
}
</script>

<style lang="less">
.success-wrapper{
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F2F3F5;

  .success-icon {
    font-size: 1.6rem;
    color: #10BF49;
  }

  .info-wrapper {
    .text {
      font-size: .16rem;
      color: #666;
    }
  }
}
</style>
