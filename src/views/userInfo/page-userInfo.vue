<template>
  <z-page>
    <el-row class="card">
      <z-tabTop :barLen="100" width="110px" v-model="index" :titleArr="tab_title"></z-tabTop>
      <el-tabs v-model="index">
        <div class="left" v-if="index==1">
            <div class="item">
              <div class="nowMonth">
                <span class="title">本月消费</span>
                <br />
                <span class="num">￥{{ (nowMonth/1000).toFixed(2)}}</span>
              </div>
              <div class="Balance">
                <span class="title">账户余额</span>
                <br />
                <div class="num">
                  <span>￥{{this.$store.state.userInfo.balance?(this.$store.state.userInfo.balance/1000).toFixed(2):'0.00'}}</span>
                  <div @click="openRecharge" class="z-btn">立即充值</div>
                </div>
              </div>
            </div>
            <div class="mouth">近12个月消费趋势</div>
            <e-chart :data="chartdata" class="item"></e-chart>
            <div class="item">
              <div class="title">充值记录</div>
              <el-table :header-cell-style="elTableClass" :data="dataList" style="width: 100%">
                <el-table-column prop="createTime" label="时间" min-width="80"></el-table-column>

                <el-table-column prop="num" label="充值金额" min-width="80">
                  <template slot-scope="scope">{{scope.row.num.toFixed(2)}}</template>
                </el-table-column>
              </el-table>
              <el-pagination
                background
                layout="prev, pager, next"
                :current-page.sync="nowPage"
                @current-change="handleCurrentChange"
                v-if="total>10"
                :total="total"
              ></el-pagination>
            </div>
        </div>
        
        <div class="right" v-if="index==2">
          <el-col class="left" :span="12">
            <div class="img">
              <img :src="this.$store.state.userInfo.headerUrl||'/img/header.svg'" alt />
            </div>
            <div class="list">
              <div class="list-item">姓名：{{this.$store.state.userInfo.name||'--'}}</div>
              <div class="list-item">账号：{{this.$store.state.userInfo.loginAccount||'--'}}</div>
              <div class="list-item">公司：{{this.$store.state.userInfo.companyName||'--'}}</div>
            </div>
          </el-col>
          <el-col class="right" :span="12">
            <div class="list">
              <div class="list-item">手机号码：{{this.$store.state.userInfo.phone||'--'}}</div>
              <div
                class="list-item"
              >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;QQ：{{this.$store.state.userInfo.qq||'--'}}</div>
            </div>
          </el-col>
        </div>
        
        
      </el-tabs>
    </el-row>

    <z-recharge :flag="rechargeFlag" @close="()=>rechargeFlag=false" :kuaifuBlance="kuaifuBlance"></z-recharge>
  </z-page>
</template>
<script>
import eChart from "./echart-data.vue";
import table from "@/assets/mixin/eltable.js";
export default {
  mixins: [table],
  data() {
    return {
      rechargeFlag: false,
      kuaifuBlance: "",
      index: "1",
      nowPage: 1,
      dataList: [],
      total: 0,
      chartdata: {},
      nowMonth: ""
    };
  },
  computed: {
    tab_title() {
      return [
        {
          name: "账户信息",
          index: "1"
        },
        {
          name: "个人信息",
          index: "2"
        }
      ];
    }
  },
  components: {
    eChart
  },
  created() {
    this.index = this.$route.params.id || "1";
    this.getdata();
    this.getnowmonthdata();
    this.getchartsdata()
  },
  watch:{
    index(val){
      if (val=='1') {
        
      }
    }
  },
  methods: {
    //立即充值打开
    openRecharge() {
      let url = "/user/getBalance";
      this.$http.post(url).then(res => {
        this.kuaifuBlance = res.data;
        this.rechargeFlag = true;
      });
    },
    //获取充值记录
    getdata(num) {
      num ? (this.nowPage = num) : null;
      let url = `/recharge/page`;
      this.$http
        .post(url, {
          pageNum: num || this.nowPage
        })
        .then(res => {
          if (res.code == "000000") {
            this.dataList = res.data.list;
            this.dataList.map(val => {
              val.num = JSON.parse(val.information).data.money;
              val.createTime = this.gettime(val.createTime);
            });
            this.total = res.data.total;
          }
        });
    },
    getnowmonthdata() {
      let url = `/deduction/map`;
      this.$http
        .post(url, {
          startMonth: this.getdatatime(new Date()),
          endMonth: this.getdatatime(new Date())
        })
        .then(res => {
          this.nowMonth = res.data[this.getdatatime(new Date())];
        });
    },
    //获取表格数据
    getchartsdata() {
      let url = `/deduction/map`;
      this.$http
        .post(url, {
          startMonth: this.getstarttime(),
          endMonth: this.getdatatime(new Date())
        })
        .then(res => {
          this.chartdata = res.data;
          console.log();
          
        });
    },
    getstarttime() {
      let time = new Date(new Date().getTime() - 335 * 24 * 3600 * 1000);

      if (time < new Date(1569910031000)) {
        return new Date(1569910031000)
          .toISOString()
          .substr(0, 7)
          .replace("-", "");
      } else {
        return time
          .toISOString()
          .substr(0, 7)
          .replace("-", "");
      }
    },
    getdatatime(val) {
      return val
        .toISOString()
        .substr(0, 7)
        .replace("-", "");
    },
    //页面切换
    handleCurrentChange(val) {
      this.nowPage = val;
      this.getdata();
    },
    //处理时间
    gettime(val) {
      return val.substr(0, 10);
    }
  }
};
</script>
<style lang="less" scoped>
.mouth {
  margin-top: 32px;
  font-size: 18px;

  line-height: 21px;
  font-weight: 500;
  color: #1e2b37;
}

.left {
  padding: 48px;
  .item {
    padding-bottom: 40px;
    border-bottom: #dfe3e8 1px solid;
    &:last-child {
      border-bottom: none;
      .title {
        margin-top: 40px;
        margin-bottom: 24px;
        font-size: 18px;
        line-height: 21px;
        font-weight: 500;
        color: #1e2b37;
      }
    }
    .nowMonth {
      display: inline-block;
      font-weight: 500;
      height: 75px;
      width: 215px;
      border-right: 1px solid #dfe3e8;
      position: relative;
      color: #1e2b37;
      .title {
        font-size: 18px;
        line-height: 21px;
      }
      .num {
        font-size: 24px;
        line-height: 24px;
        vertical-align: bottom;
        position: absolute;
        bottom: 0;
      }
    }
    .Balance {
      display: inline-block;
      height: 75px;
      color: #1e2b37;

      position: relative;
      padding-left: 100px;
      .title {
        font-weight: 500;
        font-size: 18px;
        line-height: 21px;
        color: #1e2b37;
      }
      .num {
        width: 600px;
        display: inline-block;
        position: absolute;
        bottom: 0;
        span {
          font-weight: 500;
          font-size: 24px;
          line-height: 24px;
          vertical-align: bottom;
        }
      }
    }
  }
}
.right {
  .left {
    padding: 48px;

    .img {
      margin-right: 75px;
      display: inline-block;
      width: 120px;
      height: 120px;
      img {
        width: 120px;
        height: 120px;
        border-radius: 50%;
      }
    }
    .list {
      vertical-align: top;
      display: inline-block;
      width: calc(~"100% - 195px");
      border-right: 1px solid #dfe3e8;
      .list-item {
        font-size: 14px;
        line-height: 22px;
        color: #1e2b37;
        margin-bottom: 20px;
      }
    }
  }
  .right {
    padding: 48px;
    .list {
      vertical-align: top;
      display: inline-block;
      .list-item {
        font-size: 14px;
        line-height: 22px;
        color: #1e2b37;
        margin-bottom: 20px;
      }
    }
  }
}
.z-btn {
  margin-left: 56px;
}
</style>