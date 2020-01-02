/*
  引入官方的组件
  vue
  app容器
  router
  store
*/
import Vue from 'vue'
import App from './App.vue'
import router from '@/router/index.js'
import store from '@/store/index.js'
//----------------------------------


// 引入样式 和ui框架（按需引入）和全局组件
import '@/assets/config/ui-config.js'
import '@/assets/less/common.less'
// 引入 全局组件
import "@/assets/config/global-component.js"
//----------------------------------


// 引入echart
import echart from "@/assets/config/echarts-config.js"
Vue.prototype.$echart = echart;
//----------------------------------


//引入请求AXIOS
import {instance} from '@/assets/config/axios-config.js';
Vue.prototype.$http = instance;
//----------------------------------

//引入提示
import func, { successTip,errorTip }  from '@/assets/js/common.js';
Vue.prototype.successTip = successTip;
Vue.prototype.errorTip = errorTip;
Vue.prototype.$func = func;
//----------------------------------


// 引入地址配置
import $url from '@/assets/config/address-config.js'
Vue.prototype.$url = $url;
//----------------------------------


Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
