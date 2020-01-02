import Vue from 'vue'
import Vuex from 'vuex'
import { instance as $http } from '@/assets/config/axios-config.js';
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {},    // 个人信息存储
    SmsType:[],       //短信类型存储
    License:[],        //营业执照
    userGroupList:[]
  },
  mutations: {
    // 变更userInfo状态
    changeUserInfo(state, obj) {
      state.userInfo = obj;
    },
    changeuserGroup(state,obj){
      state.userGroupList = obj;
    },
    changeSmsType(state,obj) {
            state.SmsType = obj;
        },
    changeLicense(state,obj){
      state.License = obj;
    }
  },
  actions: {
    // 拉取分组信息
    getUserGroup({ commit, state }, flag = false) {

      if (flag || state.userGroupList.length<=0) {
        return $http.post("/userGroup/list")
          .then(res => {
            var info = res.data || {};
            if (res.code != '000000') {   //session过期
              return Promise.resolve({})
            }

            commit('changeuserGroup', info);
            // console.log(`用户信息：拉取`);
            return Promise.resolve(JSON.parse(JSON.stringify(info)))

          });
      }
      // console.log(`用户信息：缓存`);
      return Promise.resolve(JSON.parse(JSON.stringify(state.userGroupList)))
    },
    // 拉取用户数据
    getUserInfo({ commit, state }, flag = false) {

      if (flag || state.userInfo && state.userInfo.ecsEmployee == undefined) {
        return $http.post("/user/info")
          .then(res => {
            var info = res.data || {};
            if (res.code != '000000') {   //session过期
              return Promise.resolve({})
            }

            commit('changeUserInfo', info);
            // console.log(`用户信息：拉取`);
            return Promise.resolve(JSON.parse(JSON.stringify(info)))

          });
      }
      // console.log(`用户信息：缓存`);
      return Promise.resolve(JSON.parse(JSON.stringify(state.userInfo)))
    },
    // 存短信类型
        getSmsType({commit,state},flag = false){
            if(flag||state.SmsType.length<=0){
                let url=`/type/all`;
                return $http.post(url)
                .then(res => {
                    var info = res.data || {};
                    if(res.code !='000000'){   //session过期
                        return Promise.reject({})
                    }
                    commit('changeSmsType',info);
                    // console.log(`用户信息：拉取`);
                    return Promise.resolve( JSON.parse(JSON.stringify(info)) )

                })
                .catch(err=>{
                    return Promise.reject(err)
                })
                
            }
            return Promise.resolve( JSON.parse(JSON.stringify(state.SmsType)) )
        },
      //存营业执照
      getLicense({commit,state},flag = false){
            if(flag||state.License.length<=0){
                let url=`/business/all`;
                return $http.post(url)
                .then(res => {
                    var info = res.data || {};
                    if(res.code !='000000'){   //session过期
                        return Promise.reject({})
                    }
                    commit('changeLicense',info);
                    // console.log(`用户信息：拉取`);
                    return Promise.resolve( JSON.parse(JSON.stringify(info)) )

                })
                .catch(err=>{
                    return Promise.reject(err)
                })
                
            }
            return Promise.resolve( JSON.parse(JSON.stringify(state.License)) )
        },
  }
})
