import Vue from 'vue';

// 导入全局组件
import page from "@/components/global/page.vue"      //基础页面

import tab_title from "@/components/global/tab-title.vue"      //tab头部

import recharge from "@/components/recharge.vue"      //tab头部
Vue.component('z-page', page);

Vue.component('z-tabTop', tab_title);
Vue.component('z-recharge', recharge);