<template>
    <div class="z-tab-title" :style="{height:`${height}px`,'line-height':`${height - 1}px`}">
        <!-- 标题 -->
        <div class="name-item" ref="titles"
        v-for="obj in calc_title" :key="obj.name"
        :class="{active:activeIndex == obj.index}" 
        
        @click="clickEvent(obj.index)"
        >{{ obj.name }}</div>

        <!-- 滑动条 -->
        <div v-show="calc_title.length" class="slip-bar" 
        :style="{width:getwidth+'px',transform:`translate3d(${barIndex*item_w+barIndex*addLeft+'px'},0,0)`}"
        ref="slip"></div>
    </div>
</template>

<script>
    export default {
        model: {
            prop: 'activeIndex',
            event: 'change'
        },
        props:{
            // tab控制
            activeIndex:{
                type:String,
                default:'0',
            },
            // 整体高
            height:{
                type:Number,
                default:45,
            },
            // 项目宽
            width:{
                type:String,
                default:'',
            },
            // 标题数组
            titleArr:{
                type:Array,
                default:function(){
                    return [];
                }
            },
            barLen:{
                type:Number,
                default:50,
            }
        },
        data(){
            return {
                addLeft:0,   // 滑动条补偿值
                item_w:0,    // 标题宽
            }
        },
        computed:{
            // 真实title数组
            calc_title(){
                let arr = this.titleArr;
                if(arr.length && typeof arr[0] == 'string'){
                    return arr.map((name,index)=>{
                        return {
                            name:name,
                            index:index,
                        }
                    })
                }else{
                    return arr || [];
                }
            },
            getwidth(){
                
                    let length = this.calc_title[this.activeIndex-1].name.length*14 +32
                    return length
                    
                
                
            },
            // 滑动条位置
            barIndex(){
                let i = 0;
                this.calc_title.some((item,index)=>{
                    return item.index == this.activeIndex && (i = index);
                })
                return i;
            }
        },
        mounted(){
           this.render();
        },
        methods:{
            clickEvent(index,i){
                this.$emit('change',index);
            },
            render(){
                if(this.calc_title.length){
                    let item = this.$refs.titles[0];
                    this.item_w = item.clientWidth;
                    this.addLeft =32;
                }
            },
        }
    }
</script>

<style lang='less'>
    @color:#69c458;
    // @height:50px;

    .z-tab-title{
        padding-left: 25px;
        height:45px;
        background:#fff;
        position: relative;
        border-bottom: 1px solid #DFE3E8;;
        .clear();

        // 头部
        .name-item{
            float: left;
            font-size: 14px;
            text-align: center;
            transition: 0.3s;
            padding:  0 16px;
            cursor: pointer;
            user-select: none;
            margin-left: 32px;
            &:first-child{
                margin-left:0;
            }
            &:hover{
                font-weight: 500;
                color: #5C6AC4;
            }
            &.active{
                font-weight: 500;
                color: #5C6AC4;
            }
        }

        .slip-bar{
            min-width:50px;
            position: absolute;
            bottom: -1px;
            height:2px;
            border-radius: 1px;
            background:#5C6AC4;;
            transition: 0.3s;
        }
    }
</style>
