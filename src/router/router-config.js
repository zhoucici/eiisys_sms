//临时登陆页
import login from "@/views/other/page-login.vue"
//容器组件
import blank from "@/components/blank.vue"
// 404页
const model = window.model

let router = [
    {
        path: '',
        name:"wait",
        redirect:{name:'home'},
        component:blank,
    },
    //404页面
    {
        path: '/404',
        alias: '*',
        name:"error",
        component:resolve => require(["@/views/other/page-error.vue"],resolve),
    },
    //功能菜单
    {
        path:'/',
        key:'menu_list',
        component:resolve => require(["@/views/index.vue"],resolve),
        children:[
            //概览页
            {
                path: 'home',
                name: 'home',
                title:"概览",
                icon:"home",
                component:resolve => require(["@/views/home/page-home.vue"],resolve),
            },
             //短信发送
            {
                path: 'sms-sending',
                name: 'smsSending',
                title:"短信发送",
                icon:"sms",
                component:resolve => require(["@/views/sms-sending/page-smsSending.vue"],resolve),
            },
             //签名管理
            {
                path: 'signature-manage',
                name: 'signature-manage',
                title:"签名管理",
                icon:"pan",
                component:resolve => require(["@/views/signature-manage/page-signatureManage.vue"],resolve),
            },
             //模板管理
            {
                path: 'temp-manage',
                name: 'temp-manage',
                title:"模板管理",
                icon:"temp",
                component:resolve => require(["@/views/template-manage/page-template.vue"],resolve),
            },
             //秘钥管理
            {
                path: 'key-manage',
                name: 'key-manage',
                title:"秘钥管理",
                icon:"key",
                component:resolve => require(["@/views/key-manage/page-key.vue"],resolve),
            },
             //短信发送记录
            {
                path: 'sms-record',
                name: 'sms-record',
                title:"短信发送记录",
                icon:"smsRecord",
                component:resolve => require(["@/views/sms-record/page-sms-record.vue"],resolve),
            },
             //发送量统计
            {
                path: 'send-data',
                name: 'send-data',
                title:"发送量统计",
                icon:"data",
                component:resolve => require(["@/views/send-data/page-sendData.vue"],resolve),
            },
            //费用统计
            {
                path: 'sen-data',
                name: 'pay-data',
                title:"费用统计",
                icon:"pay",
                component:resolve => require(["@/views/pay-data/page-payData.vue"],resolve),
            },
            //个人信息页
            {
                path: 'userInfo',
                name: 'userInfo',
                title:"个人信息",
                component:resolve => require(["@/views/userInfo/page-userInfo.vue"],resolve),
            },
        ]
    }
  ]


  // 开发模式 补充个重定向
let r_wait = router.find(item=>item.name == 'wait');
if( model != 3 && r_wait){
    r_wait.redirect = {name:'login'}
}

//开发和测试环境补一个登陆界面
if(model == 1 || model == 2){
    router.unshift({
        path: '/login',
        name:"login",
        component:login,
    })
}

export default router;