<template>
  <div class="header">
    <img @click="logo" class="logo" src="@/assets/img/logo.svg" alt />
    <div class="right">
      <el-popover placement="bottom" :visible-arrow="false" trigger="hover">
        <div class="popover">
          <div class="item">
            <span class="user">用户名</span>
            <br />
            <span class="account">{{$store.state.userInfo.loginAccount}}</span>
          </div>
          <div class="item">
            <span class="title" @click="jumpto('userInfo','1')">账户信息</span>
            <br />
            <span @click="jumpto('userInfo','2')" class="title">个人信息</span>
          </div>
          <div class="item">
            <span @click="jumpLogout" class="out">退出账号</span>
          </div>
        </div>
        <img class="headImg" slot="reference" :src="$store.state.userInfo.headerUrl||'/img/header.svg'" alt="">
      </el-popover>

      <div class="help" @click="$func.openLinkTo(document)" ></div>
      <div @click="$func.openLinkTo(front)" class="front"></div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  computed:{
    front(){
      return this.$url.sms_front +'?token='+sessionStorage.getItem('x-access-token')
    },
    document(){
      return this.$url.sms_front+'/sms-document.html?token='+sessionStorage.getItem('x-access-token')
    }
  },
  methods: {
    logo(){
        if ('home' == this.$router.currentRoute.name) {
      } else {
        this.$router.push({ name: 'home' });
      }
    },
    jumpto(val, index) {
      console.log();

      if (val == this.$router.currentRoute.name) {
        this.$parent.$children[2].index = index;
      } else {
        this.$router.push({ name: val, params: { id: index } });
      }
    },
    jumpLogout() {
      sessionStorage.clear();
      window.location.href = `${this.$url.sms_front}?action=logout`;
    }
  }
};
</script>
<style lang="less" scoped>
.header {
  height: @g_header_h;
  background: @g_header_b;
  .logo {
    cursor: pointer;
    margin: 8px 0px 8px 16px;
    height: 40px;
    width: 158px;
  }
  .right {
    float: right;
    margin: 12px 32px 12px 0px;
    .clear();
    .el-popover__reference {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      padding: 0;
      background: #d7d7d7;
      margin: 0px;
    }
    div {
      float: left;
      width: 32px;
      height: 32px;
      padding: 4px;
      margin-right: 8px;
      cursor: pointer;
      &:first-child {
        border-radius: 50%;
        padding: 0;
        background: #d7d7d7;
        margin: 0px;
      }
    }
    .help {
      background-image: url(/img/help_n.svg);
      background-repeat: no-repeat;
      background-origin: content-box;
      &:hover {
        background-image: url(/img/help_h.svg);
      }
    }
    .front {
      background-image: url(/img/front_n.svg);
      background-repeat: no-repeat;
      background-origin: content-box;
      &:hover {
        background-image: url(/img/front_h.svg);
      }
    }
  }
}
.popover {
  width: 274px;
  height: 216px;

  background: #ffffff;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.32);
  border-radius: 4px;
  .item {
    width: 100%;
    padding: 16px 24px;
    &:first-child {
      padding: 24px 24px;
    }
    &:last-child {
      border-bottom: none;
      padding: 8px 24px 16px 24px;
    }
    border-bottom: 1px solid #dfe3e8;
    .user {
      display: inline-block;
      margin-bottom: 4px;
      font-size: 16px;
      line-height: 16px;
      font-weight: 500;
      color: #1e2b37;
    }
    .account {
      font-size: 12px;
      line-height: 12px !important;
      color: #637381;
    }
    .title {
      &:hover {
        color: #202e78;
      }
      display: inline-block;
      cursor: pointer;
      font-size: 14px;
      line-height: 14px;
      color: #637381;
      margin-bottom: 16px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .out {
      cursor: pointer;
      &:hover {
        color: #202e78;
      }
      font-size: 14px;
      line-height: 14px;
      color: #637381;
    }
  }
}
</style>

