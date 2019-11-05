<template>
    <div class="pay-line" ref="render"></div>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    created() {
         setTimeout(()=>{
                    this.render();
                },300)
    },
    computed: {
        // echart实例
            my_chart(){
                let dom = this.$refs.render;
                return dom && this.$echart.init(dom);
            },
             // 横坐标
            x_arr(){
                let year = (new Date()).getFullYear()
                
                return [year+'-01',year+'-02',year+'-03',year+'-04',year+'-05',year+'-06',year+'-07',year+'-08',year+'-09',year+'-10',year+'-11',year+'-12'];
            },
            // 最终数据
            real_data(){
                return []
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