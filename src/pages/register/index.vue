<template>
  <div class="content-wrapper">
    <van-cell-group class="row flex special">
      <van-cell class="first flex1" title="姓名" :value="info.name" />
      <van-cell class="flex1 next" title="日期" :value="today" />
    </van-cell-group>

    <van-cell-group class="row">
      <van-field
        readonly
        clickable
        label="体温"
        required
        placeholder="请如实填写今日体温"
        :value="userTemperature"
        @touchstart.native.stop="show = true"
      >
        <div slot="right-icon" class="unit-text">℃</div>
      </van-field>
      <van-number-keyboard
        :show="show"
        extra-key="."
        close-button-text="完成"
        v-model="userTemperature"
        :maxlength="6"
        @blur="show = false"
      />
    </van-cell-group>

    <van-cell-group class="row">
      <van-radio-group v-model="userStatus" class="flex">
        <div class="required">
          <span>健康状况</span>
        </div>
        <van-cell-group class="flex special flex1">
          <van-cell class="first flex1" clickable @click="userStatus = '0'">
            <van-radio slot="title" name="0" />
            <div slot="right-icon">身体健康</div>
          </van-cell>
          <van-cell class="flex1 next" clickable @click="userStatus = '1'">
            <van-radio slot="title" name="1" />
            <div slot="right-icon">身体不适</div>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
      <van-field
        v-if="userStatus === '1'"
        v-model="diseaseDetail"
        rows="2"
        autosize
        label="症状描述"
        type="textarea"
        maxlength="100"
        placeholder="请输入症状"
        show-word-limit
      />
    </van-cell-group>

    <van-cell-group class="row">
      <van-radio-group v-model="userPlace" class="flex">
        <div class="address-title required">
          <span>办公地点</span>
        </div>
        <van-cell-group class="flex special flex1 health-wrapper">
          <van-cell class="address-item" clickable @click="userPlace = '0'">
            <van-radio slot="title" name="0" />
            <div slot="right-icon">家中</div>
          </van-cell>
          <van-cell class="address-item" clickable @click="userPlace = '1'">
            <van-radio slot="title" name="1" />
            <div slot="right-icon">杭州</div>
          </van-cell>
          <van-cell class="address-item" clickable @click="userPlace = '2'">
            <van-radio slot="title" name="2" />
            <div slot="right-icon">杭州湾</div>
          </van-cell>
          <van-cell class="address-item" clickable @click="userPlace = '3'">
            <van-radio slot="title" name="3" />
            <div slot="right-icon">其他</div>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
      <van-field
        v-model="placeDetail"
        rows="2"
        autosize
        label="地点描述"
        type="textarea"
        maxlength="100"
        placeholder="请输入留言"
        show-word-limit
      />
    </van-cell-group>

    <van-cell-group class="row">
      <van-field
        v-model="otherPeople"
        rows="2"
        autosize
        label="接触人员"
        type="textarea"
        maxlength="100"
        placeholder="请填写接触人员名单，逗号分隔"
        show-word-limit
      />
    </van-cell-group>

    <van-cell-group class="row">
      <van-field
        v-model="remarks"
        rows="2"
        autosize
        label="备注"
        type="textarea"
        maxlength="200"
        placeholder="请他情况请备注"
        show-word-limit
      />
    </van-cell-group>

    <van-overlay :show="isLoading">
      <div class="overlay-wrapper">
        <van-loading color="#1989fa" />
      </div>
    </van-overlay>

    <div class="footer-wrapper">
      <van-button class="create-button" type="info" @click="submit">提 交</van-button>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { Notify } from 'vant'
import { saveUserHealth } from '../../apis/index'
export default {
  name: 'register',
  data () {
    return {
      info: '',
      show: false,
      userStatus: '',
      diseaseDetail: '',
      userPlace: '',
      placeDetail: '',
      otherPeople: '',
      remarks: '',
      userTemperature: '',
      isLoading: false
    }
  },
  computed: {
    today () {
      return dayjs(new Date()).format('YYYY.MM.DD')
    }
  },
  mounted () {
    const info = JSON.parse(localStorage.info)
    this.info = info
  },
  methods: {
    submit () {
      const { userTemperature, userStatus, userPlace } = this
      if (!userTemperature) {
        Notify({ type: 'danger', message: '体温不能为空' })
        return false
      }
      if (!userStatus) {
        Notify({ type: 'danger', message: '健康状况不能为空' })
        return false
      }
      if (!userPlace) {
        Notify({ type: 'danger', message: '办公地点不能为空' })
        return false
      }

      this.isLoading = true
      this.saveUserHealth()
    },
    async saveUserHealth () {
      const writeDate = dayjs().format('YYYY-MM-DD')
      const { diseaseDetail, otherPeople, placeDetail, remarks, userTemperature, userStatus, userPlace } = this
      const data = {
        diseaseDetail,
        otherPeople,
        placeDetail,
        remarks,
        userTemperature,
        userStatus,
        userPlace,
        writeDate,
        ...this.info
      }
      try {
        await saveUserHealth(data)
        this.$router.push({name: 'success'})
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style lang="less">
.content-wrapper{
  background-color: #F2F3F5;
  height: calc(100vh - 64px);
  overflow: auto;
  position: relative;
  padding-bottom: 70px;

  .overlay-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .van-cell__value {
    text-align: left;
  }

  .flex {
    display: flex;
  }

  .flex1 {
    flex: 1;
  }
  .unit-text {
    color: #191919;
  }
  .special {
    &.van-cell::after {
      border: none;
    }
  }

  .row {
    margin-bottom: 10px;
  }

  .van-cell--required {
    &::before {
      display: none;
    }
    .van-cell__title.van-field__label span {
      position: relative;
      display: inline-block;
      padding-right: 8px;
      &::after {
        position: absolute;
        right: 0;
        color: #ee0a24;
        font-size: 14px;
        content: '*';
      }
    }
  }

  .required {
    line-height: 44px;
    padding-left: 16px;
    padding-right: 8px;
    background-color: #fff;
    position: relative;

    span {
      position: relative;
      display: inline-block;
      padding-right: 8px;
      &::after {
        position: absolute;
        right: 0;
        color: #ee0a24;
        font-size: 14px;
        content: '*';
      }
    }
    &::after {
      position: absolute;
      box-sizing: border-box;
      content: ' ';
      pointer-events: none;
      top: -50%;
      right: -50%;
      bottom: -50%;
      left: -50%;
      border-bottom: 1px solid #ebedf0;
      -webkit-transform: scale(.5);
      transform: scale(.5);
    }
  }

  .health-wrapper {
    flex-wrap: wrap;
  }

  .van-cell__title {
    text-align: left;
    flex: none;
    margin-right: .1rem;
  }

  // .address-title {
  //   margin-bottom: 0;
  // }
  .address-item {
    width: 50%;
    &::after {
      display: none;
    }
  }
  .footer-wrapper {
    width: 100%;
    background: #fff;
    padding: 10px 0;
    font-size: .14px;
    position: fixed;
    bottom: 0;

    .create-button {
      font-size: 16px;
      width: calc(100vw - 40px);
    }
  }
}
</style>
