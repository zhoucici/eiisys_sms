<template>
  <div class="menu">
    <div
      :class="{active:isActive(index)}"
      class="menu-item"
      v-for="(item, index) in main_menu"
      :key="index"
      @click.stop="linkTo(item.name)"
    >
      <img :src="getsrc(index,item.icon)" alt />
      <span>{{item.title}}</span>
    </div>
  </div>
</template>

<script>
import routerConfig from "@/router/router-config.js";

export default {
  data() {
    return {
      nowIndex: 22,
      activeTab: 0, // 一级菜单 active
      menu_on: true, //允许下拉框出现
      base_url: process.env.BASE_URL
    };
  },

  computed: {
    main_menu() {
      //主菜单
      return routerConfig
        .find(item => item.key == "menu_list")
        .children.slice(0, 8);
    }
  },

  watch: {
    $route(to) {
      this.menuChange(to);
    }
  },

  created() {
    this.menuChange(this.$route);
  },

  methods: {
    isActive(index) {
      return index == this.nowIndex;
    },
    getsrc(i, icon) {
      if (i == this.nowIndex) {
        return "/menu-icon/" + icon + "_a.svg";
      } else {
        return "/menu-icon/" + icon + "_n.svg";
      }
    },
    linkTo(name) {
      //跳链
       if (this.$route.name != name) {
        this.$router.push({ name: name });
      }
    },
    //根据路由，安排菜单选项active状态
    menuChange(route) {
      let index = 100;
      this.main_menu.map((val, i) => {
        if (val.name == route.name) {
          index = i;
        }
      });
      this.nowIndex = index;
    }
  }
};
</script>

<style lang="less" scopedd>
.menu {
  width: @g_menu_w;
  height: 100%;
  background: @g_menu_b;
  padding: 20px 8px 0 8px;
  .menu-item {
    cursor: pointer;
    margin-bottom: 10px;
    border-radius: 2px;
    width: 184px;
    height: 32px;
    font-size: 14px;
    line-height: 14px;
    color: #212b36;
    position: relative;
    &:last-child {
      margin-bottom: 0px;
    }
    span {
      position: absolute;
      width: 136px;
      height: 14px;
      left: 48px;
      top: 9px;
    }
    img {
      width: 20px;
      height: 20px;
      margin: 6px 0px 6px 10px;
    }
    &.active {
      background: rgba(92, 106, 196, 0.12);
      color: #202e78 !important;
    }
    &:hover {
      color: #202e78;
      background: rgba(92, 106, 196, 0.12);
    }
  }
}
</style>