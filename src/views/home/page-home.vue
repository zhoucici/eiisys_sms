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
              <span
                class="num"
              >{{this.$store.state.userInfo.balance?(this.$store.state.userInfo.balance/1000).toFixed(2):'0.00'}}&nbsp;</span>
              <span class="com">元</span>
              <br />
              <span class="title">账户余额</span>
            </div>
            <div @click="openRecharge" class="z-btn">立即充值</div>
          </div>
        </div>

        <div class="card">
          <div class="title">发送量数据</div>
          <div class="chart">
            <div>
              短信类型：
              <el-select
              :popper-append-to-body='false'
                style="width:130px"
                size="small"
                @change="getdata"
                v-model=" smsType"
                placeholder="请选择短信类型"
              >
                <el-option
                  v-for="(item, index) in SmsTypeList"
                  :key="index"
                  :value="item.type"
                  :label="item.name"
                ></el-option>
              </el-select>

              <el-radio-group
                style="margin-left:10px"
                @change="getdata"
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
                style="vertical-align: middle;width:263px ;margin-left:10px"
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
            <Gchart :list="dataList"></Gchart>
          </div>
        </div>
      </el-col>
      <el-col class="right" :span="8">
        <div class="card activity" v-if="ActivityData.remain">
          <div class="title">
            免费短信
            <div>
              <img src="@/assets/img/activity.svg" alt />
              <div
                @click="$func.openLinkTo($url.sms_front+'/sms-activity.html?token='+token)"
                class="z-btn text"
              >活动详情</div>
            </div>
          </div>
          <div class="activity-content">
            <div v-if="!ActivityData.templateCode" @click="openBind" class="z-btn">绑定模板</div>
            <div v-else>
              <span>
                模板名称：
                <font>{{ActivityData.templateName}}</font>
              </span>
              <div @click="useActivity" class="z-btn text">立即使用</div>
            </div>
            <div class="surplus">
              <span>总条数：{{ActivityData.amount}}条</span>
              <span>剩余：{{ActivityData.remain}}条</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="title">快速操作</div>
          <div class="item">
            <div class="item-title floatleft">
              已有短信签名&nbsp;
              <span>{{this.$store.state.userInfo.signatureAmount}}</span>&nbsp;个
            </div>
            <div @click="goto('signature-manage')" class="z-btn text floatright">添加签名</div>
          </div>
          <div class="item">
            <div class="item-title floatleft">
              已有短信模板&nbsp;
              <span>{{this.$store.state.userInfo.templateAmount}}</span>&nbsp;个
            </div>
            <div @click="goto('temp-manage')" class="z-btn text floatright">添加模板</div>
          </div>
          <div class="item">
            <div class="item-title floatleft">发送短信</div>
            <div @click="goto('sms-sending')" class="z-btn text floatright">立即发送</div>
          </div>
        </div>

        <div class="card">
          <div class="title">帮助</div>
          <div class="item">
            <div class="item-title floatleft">使用说明</div>
            <div @click="$func.openLinkTo(front1)" class="z-btn text floatright">了解详情</div>
          </div>
          <div class="item">
            <div class="item-title floatleft">短信业务规则</div>
            <div @click="$func.openLinkTo(front2)" class="z-btn text floatright">了解详情</div>
          </div>
          <div class="item">
            <div class="item-title floatleft">短信价格详情</div>
            <div @click="$func.openLinkTo(front3)" class="z-btn text floatright">了解详情</div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      top="20vh"
      title="绑定模板"
      :visible.sync="bindFlag"
      width="600px"
      :before-close="()=>bindFlag=false"
    >
      <div class="bindMain">
        <div class="bindItem">
          <label>短信类型：</label>
          <el-select style="width:436px;" size="small" v-model="bindSmsType" @change="getTemplate" placeholder="请选择短信类型">
            <el-option :value="1" label="通知类短信"></el-option>
            <el-option :value="3" label="验证码短信"></el-option>
          </el-select>
        </div>
        <div class="bindItem">
          <label>模板名称：</label>
          <el-select style="width:436px;margin-top:20px" size="small" v-model="nowTemplate" placeholder="请选择模板名称">
            <el-option
              v-for="(item, index) in templateList"
              :key="index"
              :value="item.templateCode"
              :label="item.templateName"
            ></el-option>
          </el-select>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <div class="z-btn" @click="bind()">确 定</div>
        <div class="z-btn normal" @click="()=>bindFlag=false">取 消</div>
      </span>
    </el-dialog>
    <z-recharge :flag='rechargeFlag' @close='()=>rechargeFlag=false' :kuaifuBlance='kuaifuBlance'></z-recharge>

  </z-page>
</template>
<script>
import Gchart from "@/components/data-chart.vue";
export default {
  components: {
    Gchart
  },
  computed:{
    front1(){
      return this.$url.sms_front +'/sms-document.html?index=1'
    },
    front2(){
      return this.$url.sms_front +'/sms-document.html?index=2'
    },
    front3(){
      return this.$url.sms_front +'/sms-document.html?index=3'
    }
  },
  data() {
    return {
      bindSmsType: "",
      templateList: [],
      nowTemplate: "",
      bindFlag: false,
      rechargeNum: 10,
      rechargeFlag: false,
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
      value: "",
      chartType: "1", //表格类型  1=7天  2=31天 3=自定义
      searchTime: [
        new Date(new Date().getTime() - 7 * 24 * 3600 * 1000),
        new Date()
      ], //自定义时间容器
      dayData: "--", //今日成功发送数量
      monthData: "--",
      SmsTypeList: [],
      dataList: [],
      timeOptionRange: "",
      smsType: "",
      kuaifuBlance: "",
      ActivityData: "",
      token: sessionStorage.getItem("x-access-token")
    };
  },
  created() {
    //初始化一些数据 调用一些函数
    this.$store.dispatch("getUserInfo",true)
    this.getDayData();
    this.getMonthData();
    this.getActivityInfo();
    //获取短信类型
    this.$store.dispatch("getSmsType").then(res => {
      this.SmsTypeList = res;
      this.smsType = this.SmsTypeList[0].type;
      this.getChartDat();
      this.getdata();
    });
  },
  watch: {
    chartType(val) {
      this.getChartDat();
    }
  },
  methods: {
    openBind() {
      this.bindSmsType=''
      this.nowTemplate=''
      this.bindFlag = true;
    },
    //获取模板
    getTemplate() {
      this.nowTemplate = "";
      let url = `/template/list`;
      this.$http
        .post(url, {
          smsType: this.bindSmsType
        })
        .then(res => {
          if (res.code == "000000") {
            this.templateList = res.data;
          }
        });
    },
    //绑定活动模板
    bind() {
      if(this.nowTemplate&&this.bindSmsType){
        let url = `/activity/record/bind`
      this.bindFlag=false
      this.$http.post(url,{
        templateCode:this.nowTemplate
      })
      .then(res=>{
        console.log(res);
        if(res.code=='000000'){
          this.successTip('绑定成功')
          this.getActivityInfo()
        }else{
          this.errorTip(res.message)
        }
      })
      }else{
        this.errorTip('请选择短信类型和短信模板！')
      }
      
    },
    //使用活动模板发送 这里带参数跳转
    useActivity() {
      console.log(this.ActivityData);
      
      this.$router.push({
        name: "sms-sending",
        params: this.ActivityData
      });
    },
    //是否活动信息获取
    getActivityInfo() {
      let url = `/activity/record/info`;
      this.$http.post(url).then(res => {
        console.log(res);
        if (res.code == "000000"&&res.data) {
          this.ActivityData = res.data;
        }
      });
    },
    //立即充值打开
    openRecharge() {
      let url = "/user/getBalance";
      this.$http.post(url).then(res => {
        this.kuaifuBlance = res.data;
        this.rechargeFlag = true;
      });
    },
    //充值方法
    recharge() {
      let reg = /^((1[0-9])|([2-9]\d)|([1-9]\d{2,}))$/;
      if (!reg.test(this.rechargeNum)) {
        this.errorTip("请输入正确的数值！");
        return;
      }
      this.rechargeFlag = false;
      let url = `/user/recharge`;
      this.$http.post(url, this.rechargeNum).then(res => {
        if (res.code == "000000") {
          this.$store.dispatch("getUserInfo", true);
          this.getActivityInfo()
          this.successTip("充值成功");
        } else {
          this.errorTip(res.message);
        }
      });
    },
    //跳转到添加签名
    goto(val) {
      this.$router.push({ name: val });
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
        }
      });
    },
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
      this.$http.post(url, {});
    }
  }
};
</script>
<style lang="less" scoped>
.recharge-main {
  padding: 0 20px;
  font-size: 14px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.85);
  span {
    color: #5c6ac4;
  }
  .kuaifu-balance {
    padding-bottom: 20px;
    border-bottom: 1px solid #e9e9e9;
    .z-btn {
      margin-left: 16px;
    }
  }
  .sms-balance {
    padding: 20px 0 16px 0;
  }
  .recharge-num {
    .recharge-tip {
      line-height: 31px;
      color: rgba(0, 0, 0, 0.85);
      margin-left: 5px;
    }
    .tip {
      margin-top: 12px;
      margin-left: 74px;
      color: #99a4ad;
      margin-bottom: 12px;
    }
  }
}
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
      &.activity {
        height: 161px;
      }
      height: 215px;
      > .title {
        > div {
          position: relative;
          img {
            position: absolute;
            top: 18px;
            right: 66px;
          }
          .z-btn {
            padding-top: 10px;
          }
          float: right;
        }
      }
      .activity-content {
        font-size: 14px;
        padding: 16px;
        color: #1e2b37;
        .surplus {
          margin-top: 16px;
          color: #637381;
          font-size: 12px;
          line-height: 20px;
          span {
            margin-right: 15px;
          }
        }
        font {
          color: #637381;
        }
        > div {
          .z-btn {
            float: right;
          }
        }
      }
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
      .z-btn {
        line-height: 32px;
        vertical-align: bottom;
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