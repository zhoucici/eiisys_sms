<template>
  <div class="front-index" style="height: 100%;">
    <!-- 头部导航栏 -->
    <headerbar></headerbar>
    <div class="main">
      <!-- 左侧菜单栏 -->
      <menuList class="page-left"></menuList>
      <!-- 右侧内容主体 -->
      <div class="page-right">
        <transition name="el-fade-in-linear">
          <router-view></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
import menuList from "./index/menu.vue";
import headerbar from "./index/header.vue";
export default {
  components: {
    menuList,
    headerbar
  },

  computed: {
    user() {
      return this.$store.getters.userInfo;
    },
    avatar() {
      return this.user.headerUrl || "~@/assets/img/avatar.svg";
    }
  },

  created() {},
  mounted() {},
  methods: {}
};
</script>

<style lang="less" scopedd>
.front-index {
  .clear();
  min-width: @g_main_minW;
}
.main{
  height:calc(~"100% - @{g_header_h}");
  
  .page-left{
    float: left;
    
  }
  .page-right{
    float: left;
    position: relative;
    background: #f0f2f5;
    height:100%;
    width: calc(~"100% -  @{g_menu_w}");
    overflow: auto;
  }
}

</style>
