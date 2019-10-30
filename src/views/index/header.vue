<template>
  <div class="header">
    <img class="logo" src="@/assets/img/logo.svg" alt />
    <div class="right">
      <div></div>
      <div class="front">
      </div>
      <div class="help">
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.header {
  height: @g_header_h;
  background: @g_header_b;
  .logo {
    margin: 8px 0px 8px 16px;
    height: 40px;
    width: 158px;
  }
  .right {
    float: right;
    margin: 12px 32px 12px 0px;
    .clear();
    div {
      float: right;
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
    .help{
      background-image: url(/img/help_n.svg);
      background-repeat: no-repeat;
      background-origin:content-box;
      &:hover{
        background-image: url(/img/help_h.svg);
      }
    }
    .front{
      background-image: url(/img/front_n.svg);
      background-repeat: no-repeat;
      background-origin:content-box;
      &:hover{
        background-image: url(/img/front_h.svg);
      }
    }
  }
}
</style>

