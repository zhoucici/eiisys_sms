<template>
  <z-page title="概览">
    <el-row class="main" :gutter="24">
      <el-col class="left" :span="16">
        <div class="card main-data">
          <div class="item">
            <span class="num">{{dayData}}&nbsp;</span>
            <span class="com">条</span>
            <br />
            <span class="title">今日成功发送</span>
          </div>
          <div class="item">
            <span class="num">{{monthData}}&nbsp;</span>
            <span class="com">条</span>
            <br />
            <span class="title">本月成功发送</span>
          </div>
          <div class="item">
            <div style="display:inline-block">
              <span class="num">{{this.$store.state.userInfo.balance||'--'}}&nbsp;</span>
              <span class="com">元</span>
              <br />
              <span class="title">账户余额</span>
            </div>
            <div class="z-btn">立即充值</div>
          </div>
        </div>
        <div class="card">
          <div class="title">发送量数据</div>
          <div class="chart">
            <div>
              短信类型：
              <el-select style="width:130px" size="small" v-model="nowSmsType.id" placeholder="请选择">
                <el-option
                  v-for="(item, index) in SmsTypeList"
                  :key="index"
                  :value="item.id"
                  :label="item.name"
                ></el-option>
              </el-select>

              <el-radio-group style="margin-left:10px" size="small" v-model="chartType">
                <el-radio-button label="1">7&nbsp;天</el-radio-button>
                <el-radio-button label="2">31&nbsp;天</el-radio-button>
                <el-radio-button label="3">自定义</el-radio-button>
              </el-radio-group>
              <el-date-picker
                v-if="chartType=='3'"
                style="float:right;width:290px"
                v-model="searchTime"
                size="small"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </div>
            <div class="chart-main"></div>
          </div>
        </div>
      </el-col>
      <el-col class="right" :span="8">
        <div class="card">
          <div class="title">快速操作</div>
          <div class="item">
            <div class="item-title floatleft">
              已有短信签名&nbsp;
              <span>{{this.$store.state.userInfo.signatureAmount}}</span>&nbsp;个
            </div>
            <div class="z-btn text floatright">添加签名</div>
          </div>
          <div class="item">
            <div class="item-title floatleft">
              已有短信模板&nbsp;
              <span>{{this.$store.state.userInfo.templateAmount}}</span>&nbsp;个
            </div>
            <div class="z-btn text floatright">添加模板</div>
          </div>
          <div class="item">
            <div class="item-title floatleft">发送短信</div>
            <div class="z-btn text floatright">立即发送</div>
          </div>
        </div>

        <div class="card">
          <div class="title">帮助</div>
          <div class="item">
            <div class="item-title floatleft">使用说明</div>
            <div class="z-btn text floatright">了解详情</div>
          </div>
          <div class="item">
            <div class="item-title floatleft">短信业务规则</div>
            <div class="z-btn text floatright">了解详情</div>
          </div>
          <div class="item">
            <div class="item-title floatleft">短信价格详情</div>
            <div class="z-btn text floatright">了解详情</div>
          </div>
        </div>
      </el-col>
    </el-row>
  </z-page>
</template>
<script>
export default {
  data() {
    return {
      value: "",
      chartType: "1", //表格类型  1=7天  2=31天 3=自定义
      searchTime: "", //自定义时间容器
      dayData: "--", //今日成功发送数量
      monthData:"--",
      SmsTypeList: [],
      nowSmsType: {
        //用于搜索数据的短信类型
        id: ""
      }
    };
  },
  created() {
    //初始化一些数据 调用一些函数
    this.getDayData();
    this.getMonthData();

    //获取短信类型
    this.$store.dispatch("getSmsType").then(res => {
      this.SmsTypeList = res;
      this.nowSmsType = this.SmsTypeList[0];
      this.getChartDat();
    });
  },
  watch: {
    chartType(val) {
      this.getChartDat();
    }
  },
  methods: {
    //获取今日成功发送
    getDayData() {
      let url = `/statistics/day/today`;
      this.$http.post(url).then(res => {
        this.dayData = res.code == "000000" ? res.data.success : "--";
      });
    },
    //获取本月成功发送
    getMonthData() {
      let url = `/statistics/month/this`;
      this.$http.post(url).then(res => {
        this.monthData = res.code == "000000" ? res.data.success : "--";
      });
    },
    getChartDat() {
      let url = `/statistics/day/today`;
      this.$http.post(url,{
        
      })
    }
  }
};
</script>
<style lang="less" scoped>
.main {
  padding-top: 24px;
  .main-data {
    height: 114px;
    padding-top: 24px;
    .clear();
    .item {
      float: left;
      width: 27.6%;
      height: 66px;
      border-right: 1px solid #dfe3e8;
      text-align: center;
      color: #1e2b37;
      font-size: 14px;
      line-height: 14px;

      .num {
        font-size: 24px;
        line-height: 34px;
        font-weight: 500;
      }
      .title {
        margin-top: 50px;
        font-size: 14px;
        line-height: 34px;
        color: #637381;
      }
      &:last-child {
        width: 44.8%;
        border-right: none;
        .z-btn {
          margin-left: 37px;
          vertical-align: 80%;
        }
      }
    }
  }
  .chart {
    padding: 16px;
    .chart-main {
      margin: 16px 0 43px;
      height: 181px;
      background: burlywood;
    }
  }
  .right {
    .card {
      height: 215px;
    }
    .item {
      .clear();
      &:first-child {
        margin-top: 8px;
      }
      padding: 8px 16px;
      .item-title {
        font-size: 14px;
        line-height: 32px;
        color: #1e2b37;
        span {
          color: #007ace;
          font-weight: 500;
        }
      }
    }
  }
}
/deep/ .el-range-input {
  width: 100px;
}
/deep/.el-range-separator {
  width: 24px;
}
</style>