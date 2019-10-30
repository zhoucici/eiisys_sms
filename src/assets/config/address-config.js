const model = window.model;

// 1 开发模式  2 测试模式  3 线上模式
const keyObj = {
    1:'dev',
    2:'test',
    3:"online"
}
const webUrl = {
    // 开发模式
    dev:{
        eiisys_sms:'/eiisys_sms'
    },
    // 测试模式
    test:{
        eiisys_sms:'http://122.112.204.156:8290'
    },
    // 线上模式
    online:{
        eiisys_sms:'http://122.112.204.156:8290'
    },
}




export default webUrl[keyObj[model]]
