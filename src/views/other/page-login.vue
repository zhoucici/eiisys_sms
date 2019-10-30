<template>
    <div class="login-wrap">
        用户名：<input v-model="name">
        密码：<input v-model="password" type='password'>
        <div class="z-btn" @click="login">登 录</div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                name:"zmt1@163.com",
                password:"abcdefg",
            }
        },
    created(){
        
    },
        methods:{
            login(){
                let url = `/fastlogin`;
                this.$http.post(url,"",{
                    params:{
                        account:this.name,
                        password:this.password
                    }
                })
                .then((res)=>{
                    console.log(res);
                    if(res){
                        sessionStorage.setItem('x-access-token',res)
                        this.$router.push({name:'home'})
                    }
                })

            },
        }
    }
</script>

<style lang="less" scopedd>
    .login-wrap{
        padding: 20px 30px;
        input{
            margin-right: 20px;
        }
    }
</style>
