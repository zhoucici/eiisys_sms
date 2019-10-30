<template>
  <div class="z-page">
    <div v-if="func" @click="func()" class="back">
      <img src="@/assets/img/back.svg" alt />
      <span>返回</span>
    </div>
    <div class="title">{{title}}</div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    // 滚轮滚动一次位移的距离
    title: {
      type: String
    },
    func:{
      type:Function
    }
  }
};
</script>

<style lang="less" scoped>
.z-page {
  background: #f0f2f5;
  height: 100%;
  position: relative;
  overflow: auto;
  padding: 24px 24px 0 24px;
  .back {
    cursor: pointer;
    display: inline-block;
    font-size: 14px;
    line-height: 20px;
    color: #637381;
    span{
      vertical-align: top;
    }
  }
  & > .title {
    font-size: 28px;
    line-height: 28px;
    color: #1e2b37;
  }
}
</style>





