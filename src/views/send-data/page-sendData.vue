<template>
  <z-page title="发送量统计">
    <el-row class="card">
      <div class="content">
        <div class="page-search">
          <div class="search-item">
            <label>短信类型：</label>
            <el-select @change="getdata" :popper-append-to-body='false' size="small" v-model="smsType" placeholder="请选择短信类型">
              <el-option
                v-for="(item, index) in SmsTypeList"
                :key="index"
                :value="item.type"
                :label="item.name"
              ></el-option>
            </el-select>
            <el-radio-group
              @change="getdata"
              style="margin-left:10px"
              size="small"
              v-model="chartType"
            >
              <el-radio-button label="1">7&nbsp;天</el-radio-button>
              <el-radio-button label="2">31&nbsp;天</el-radio-button>
              <el-radio-button label="3">自定义</el-radio-button>
            </el-radio-group>
            <el-date-picker
              @change="getdata"
              v-if="chartType=='3'"
              style="margin-left:10px"
              v-model="searchTime"
              size="small"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyyMMdd"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </div>
        </div>
        <div class="chart-title">短信发送数据走势图</div>
        <Gchart :list="dataList"></Gchart>
        <el-table :header-cell-style="elTableClass" :data="dataList" style="width: 100%">
          <el-table-column prop="time" label="统计时间" min-width="80"></el-table-column>
          <el-table-column prop="send" align="right" label="发送总数（条）" min-width="120"></el-table-column>
          <el-table-column prop="success" align="right" label="发送成功数（条）" min-width="150"></el-table-column>
          <el-table-column align="right" label="发送成功率（%）" min-width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.send==0">--</span>
              <span v-else>{{(scope.row.success*100 / scope.row.send).toFixed(2)+'%'}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="60" label="操作">
            <template slot-scope="scope">
              <div @click="!scope.row.fail?null:failitem(scope.row)" style="margin:0" class="z-btn text" :class="{disabled:!scope.row.fail}">失败详情</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-row>
  </z-page>
</template>
<script>
import table from "@/assets/mixin/eltable.js";
import Gchart from "@/components/data-chart.vue";
export default {
  mixins: [table],
  components: {
    Gchart
  },
  data() {
    return {
      // 限制时间
      pickerOptions: {
        onPick: time => {
          this.timeOptionRange = time.minDate;
        },
        disabledDate: time => {
          let timeOptionRange = this.timeOptionRange;
          let seven = 3600 * 1000 * 24 * 30;
          if (timeOptionRange) {
            // /*选择的日期 与 当前日期 小于7天*/
            let current =
              new Date(new Date().toLocaleDateString()) -
              timeOptionRange.getTime();
            return (
              time.getTime() >
                timeOptionRange.getTime() +
                  (current < seven ? current : seven) ||
              time.getTime() < timeOptionRange.getTime() - seven
            );
          } else {
            return time.getTime() > Date.now();
          }
        }
      },
      dataList: [],
      chartType: "1", //1 7天 2 31天 3 自定义
      smsType: "",
      SmsTypeList: [],
      timeOptionRange: "",
      searchTime: [
        new Date(new Date().getTime() - 7 * 24 * 3600 * 1000),
        new Date()
      ],
      chartData: []
    };
  },
  created() {
    //获取短信类型
    this.$store.dispatch("getSmsType").then(res => {
      this.SmsTypeList = res;
      this.smsType = this.SmsTypeList[0].type;
      this.getdata();
    });
  },
  methods: {
    //失败跳转到记录
    failitem(val){
      console.log(val);
      this.$router.push({
        name:'sms-record',
        params: {
          status:2,
          time:val.time
          }
        })
    },
    getdata() {
      let url = `/statistics/day/map`;
      let obj = {
        beginTime: "20191011",
        endTime: "20191018",
        smsType: this.smsType
      };

      switch (this.chartType) {
        case "1":
          obj.beginTime = new Date(new Date().getTime() - 6 * 24 * 3600 * 1000)
            .toISOString()
            .substr(0, 10)
            .replace(/-/g, "");
          obj.endTime = new Date()
            .toISOString()
            .substr(0, 10)
            .replace(/-/g, "");
          break;
        case "2":
          obj.beginTime = new Date(new Date().getTime() - 30 * 24 * 3600 * 1000)
            .toISOString()
            .substr(0, 10)
            .replace(/-/g, "");
          obj.endTime = new Date()
            .toISOString()
            .substr(0, 10)
            .replace(/-/g, "");
          break;
        default:
          if (!this.searchTime) {
            this.timeOptionRange = null;
            return;
          }
          if (typeof this.searchTime[0] == "object") {
            console.log(this.searchTime[0].toISOString());
            this.searchTime[1] = this.searchTime[1]
              .toISOString()
              .substr(0, 10)
              .replace(/-/g, "");
            this.searchTime[0] = this.searchTime[0]
              .toISOString()
              .substr(0, 10)
              .replace(/-/g, "");
            obj.beginTime = this.searchTime[0];
            obj.endTime = this.searchTime[1];
          }
          obj.beginTime = this.searchTime[0];
          obj.endTime = this.searchTime[1];
          break;
      }

      this.$http.post(url, obj).then(res => {
        let arr = [];
        if (res.code == "000000") {
          this.chartData = res.data;
          for (const key in res.data) {
            let obj = {};
            obj.time =
              key.slice(0, 4) + "-" + key.slice(4, 6) + "-" + key.slice(6);
            for (const value in res.data[key]) {
              obj[value] = res.data[key][value];
            }
            arr.push(obj);
          }

          this.dataList = arr;
        } else {
          this.errorTip(res.message);
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.card {
  padding: 24px;
  margin: 24px 0;
  .chart-title {
    text-align: center;
    font-size: 14px;
    line-height: 22px;
    margin-top: 35px;
  }
}
</style>