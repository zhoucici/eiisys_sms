import axios from "axios";
import $url from '@/assets/config/address-config.js'
// import { errorTip } from '@/assets/js/common.js'
const server = $url.eiisys_sms;  //地址

export const instance = axios.create({
    baseURL: server + '/sms',
    headers: {
        "Content-Type": "application/json;charset=utf-8",
    },
    timeout: 30000,
    withCredentials: true, //请求头带cookie
})



instance.interceptors.request.use(
    request=>{
        request.headers['x-access-token'] = sessionStorage.getItem('x-access-token');      

        
        return request;
    }
)

instance.interceptors.response.use(
    response => {
        

        return response.data;
    },
    
    error => {
        // errorTip('请求失败')
        return Promise.reject(error);
    }

);
