import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import $store from '@/store/index.js'
import $url from '@/assets/config/address-config.js'
//引入路由配置
import routeConfig from './router-config.js'
Vue.use(VueRouter)

const router= new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routeConfig,
  history: false,
  hashbang: true
})
export default router;
router.beforeEach((to, from, next) => {
  // 带token登录时，获取token
  let onceToken = to.query.token;
  if (onceToken) {
    let url = `${$url.sass}/token`
    //验证onceToken
    return axios.post(url, {
      once_token: onceToken,
      cmd: 'token_login',
      "53kf_token": 'Aj|uU620cjJ`53kf'
    }, {
      transformRequest: [function (data) {
        let ret = ''
        for (let it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
      }],
    })
      .then(({ data: { server_response: res } }) => {
        console.log(res);
        
        if (res.token) {
          sessionStorage.setItem('x-access-token', res.token);
          next()
        } else {
          // alert('令牌失效，登录过期！')
          // window.location.href = $url.sms_front+'?action=logout'
          // next({ name: 'error' })
        }
      })
      .catch(err => {
        alert('令牌失效，登录过期！')
        window.location.href = $url.sms_front+'?action=logout'
        // next({ name: 'error' })
      })
  }
  let pages = ['login', 'wait', 'noPermission', 'error'];
  if (pages.some(name => to.name == name)) {
    next();
    return;
  }

  // 正常页面
    let code;  //访问页面所需权限
    $store.dispatch("getUserInfo")
    .then(info=>{
        if(!info.id){ //没有登录信息  登录验证
            // 跳到官网
              window.location.href = $url.sms_front
            next()
            return;
        }
       next()
    })
})