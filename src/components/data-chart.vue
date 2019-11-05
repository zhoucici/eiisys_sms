<template>
    <div class="data-line" ref="render"></div>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    props:{
        // 数据
            list:{
                type:Array,
                default(){
                    return [];
                },
            }
    },
     watch:{
            list(val){
                this.render(); 
            },
        },
    created() {
         setTimeout(()=>{
                    this.render();
                },300)
                window.addEventListener("resize",  ()=> {

          this.my_chart.resize()

        });
    },
    computed: {
        // echart实例
            my_chart(){
                let dom = this.$refs.render;
                return dom && this.$echart.init(dom);
            },
             // 横坐标
            x_arr(){
                let x=[]

                this.list.map(val=>{
                    x.push(val.time)
                })
                return x
                
            },
            // 最终数据
            real_data(){
                return []
            },
            // 最终数据
            real_data(){
                let sendObj=[]
                let successObj=[]
                
               this.list.map(item=>{
                   sendObj.push(item.send)
                   successObj.push(item.success)
                })
                 return [{
                     data:sendObj,
                     type:'line'
                 },{
                     data:successObj,
                     type:'line'
                 }]
            },
            // 图例
            legend_data(){
                return []
            },
    },
    methods: {
        // 渲染
            render(){
                let option = {
                    title: {
                        text: this.title,          // 标题
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:this.legend_data,     //图例
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.x_arr,           // 横坐标
                    },
                    yAxis: {
                        type: 'value',
                        minInterval:1,
                    },
                    series: this.real_data,         // 数据
                };
                this.my_chart.setOption(option);
            },
    },
}
</script>
<style lang="less" scoped>
    .data-line{
        width: 100%;
        height: 300px;
    }
</style>