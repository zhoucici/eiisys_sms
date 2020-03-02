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
        sms_front:'http://122.112.204.156:7078',
        sass:"https://api.saas.71baomu.com",
        eiisys_sms:'http://122.112.204.156:8290',
        kuaifu:'http://www.71baomu.com',
        eiisys_smsindex:"https://peiisys.eiisys.com/html/eiisys-index.html",  // 海翕云对应官网
    },
    // 测试模式
    test:{
        sass:"http://api.saas.71baomu.com",
        kuaifu:'http://www.71baomu.com',
        eiisys_sms:'http://122.112.204.156:8290',
        eiisys_smsindex:"https://peiisys.eiisys.com/html/eiisys-index.html",  // 海翕云对应官网
        sms_front:'http://122.112.204.156:7078'
    },
    // 线上模式
    online:{
        kuaifu:'http://www.kuaifuwang.cn',
        sms_front:'http://www.eisms.cn',
        sass:"https://api.saas.53kf.com",
        eiisys_sms:'http://smsweb.eisms.cn',
        eiisys_smsindex:"eiisys.com",  // 海翕云对应官网
    },
}

export default webUrl[keyObj[model]]
