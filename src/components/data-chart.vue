<template>
  <div class="data-line" ref="render"></div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    // 数据
    list: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  watch: {
    list(val) {
      this.render();
    }
  },
  created() {
    setTimeout(() => {
      this.render();
    }, 300);
    window.addEventListener("resize", () => {
      this.my_chart.resize();
    });
  },
  computed: {
    // echart实例
    my_chart() {
      let dom = this.$refs.render;
      return dom && this.$echart.init(dom);
    },
    // 横坐标
    x_arr() {
      let x = [];

      this.list.map(val => {
        x.push(val.time);
      });
      return x;
    },
    // 最终数据
    real_data() {
      return [];
    },
    // 最终数据
    send_data() {
      let sendObj = [];
      let successObj = [];

      this.list.map(item => {
        sendObj.push(item.send);
        successObj.push(item.success);
      });
      return sendObj;
    },
    success_data() {
      let sendObj = [];
      let successObj = [];

      this.list.map(item => {
        sendObj.push(item.send);
        successObj.push(item.success);
      });
      return successObj;
    },
    // 图例
    legend_data() {
      return [];
    }
  },
  methods: {
    // 渲染
    render() {
      let option = {
        color: ["#5894c4", "#71ac61"],
        tooltip: {
          trigger: "axis"
        },
        legend: {
          icon: "circle",
          type: "plain",
          bottom: "3%",
          data: ["发送成功数", "发送总数"]
        },
        grid: {
          top: "3%",
          right: "4%",
          left: "4%",
          bottom: "20%",
          show: true,
          backgroundColor: "#f4f7fa"
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          
          axisTick:{show:false},
          boundaryGap: true,
          data: this.x_arr // 横坐标
        },
        yAxis: {
          type: "value",
          
          axisTick:{show:false},
          minInterval: 1
        },
        series: [
          {
            name: "发送成功数",
            data: this.success_data,
            type: "line",
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 3, //折线宽度
                }
              }
            }
          },
          {
            data: this.send_data,
            name: "发送总数",
            type: "line",
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 3, //折线宽度
                  color: "#71ac61" //折线颜色
                }
              }
            }
          }
        ]
      };
      this.my_chart.setOption(option);
    }
  }
};
</script>
<style lang="less" scoped>
.data-line {
  width: 100%;
  height: 300px;
}
</style>