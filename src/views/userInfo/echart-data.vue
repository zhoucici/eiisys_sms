<template>
  <div class="pay-line" ref="render"></div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    // 数据
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  created() {
    console.log(111);
    
    setTimeout(() => {
      this.render();
      
    }, 300);

    
  },
  computed: {
    // echart实例
    my_chart() {
      let dom = this.$refs.render;
      return dom && this.$echart.init(dom);
    },
    // 横坐标
    x_arr() {
      var d = new Date(new Date().getTime() - 335 * 24 * 3600 * 1000);
      var result = [];
      for (var i = 0; i < 12; i++) {
        var m = d.getMonth() + 1;

        m = m < 10 ? "0" + m : m;
        result.push(d.getFullYear() + "-" + m);
        d.setMonth(d.getMonth() + 1);
      }
      return result;
    },
    // 最终数据
    real_data() {
      let arr = [];
      this.x_arr.map((val, i) => {
        if (
          this.data[val.replace("-", "")] ||
          this.data[val.replace("-", "")] === 0
        ) {
          arr[i] = this.data[val.replace("-", "")];
        }
        arr[i] = 0;
      });
      return arr;
    }
  },
  methods: {
    // 渲染
    render() {
      let option = {
        color: ["#5B8FF9"],
        tooltip: {
          trigger: "axis"
        },
        legend: {
          x: "0px",
          y: "20px",
          orient: "horizontal",
          selectedMode: false,
          data: [
            {
              name: "消费额",
              textStyle: {
                fontSize: 12,
                fontWeight: "bolder",
                color: "#8C8C8C"
              },
              icon: "image:///img/line.svg"
            }
          ]
        },
        grid: {
          left: "2%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisTick: {
            lineStyle: {
              color: "#BDC8D3"
            }
          },
          axisLine: {
            lineStyle: {
              width: 1 // 粗细
            }
          },

          data: this.x_arr // 横坐标
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: false,
            lineStyle: {
              width: 1 // 粗细
            }
          },
          axisTick: { show: false },
          minInterval: 1
        },
        series: [
          {
            name: "消费额",
            data: this.real_data,
            symbolSize: 0,
            type: "line",
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 2 //折线宽度
                }
              }
            }
          }
        ] // 数据
      };
      this.my_chart.setOption(option);
      window.onresize = () => {
      this.my_chart.resize();
    };
    }
  }
};
</script>
<style lang="less" scoped>
.pay-line {
  width: 100%;
  height: 300px;
}
</style>