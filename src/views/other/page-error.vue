<template>
    <div class="wrap">
        <div class="mid">
            <img  src="@/assets/img/404.svg">
            <div>抱歉，您访问的页面出现了错误</div>
            <span @click="$router.push({name:'home'})">返回首页</span>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scopedd>
    .wrap{
        position: relative;
        height:100%;
        background: #E9E9E9;
    }
    .mid{
        position: absolute;
        top:40%;
        left:50%;
        transform:translate(-50%,-50%);
        text-align: center;
        >div{
            font-size: 16px;
            margin-top: 20px;
        }
        >span{
            display: inline-block;
            margin-top: 16px;
            cursor: pointer;
            user-select: none;
            color:#16A3FF;
        }
    }
</style>
