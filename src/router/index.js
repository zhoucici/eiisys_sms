import Vue from 'vue'
import VueRouter from 'vue-router'
import $store from '@/store/index.js'
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
        if (res.token) {
          sessionStorage.setItem('token', res.token);
          next()
        } else {
          next({ name: 'error' })
        }
      })
      .catch(err => {
        next({ name: 'error' })
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
              window.location.href = `http://eiisys.com`
            next()
            return;
        }
       next()
    })
})