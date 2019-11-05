<template>
  <z-page>
    <el-row class="card">
      <el-tabs v-model="index">
        <el-tab-pane class="left" label="账号信息" name="1">
          <div class="item">
            <div class="nowMonth">
              <span class="title">本月消费</span>
              <br />
              <span class="num">￥1230.00</span>
            </div>
            <div class="Balance">
              <span class="title">账户余额</span>
              <br />
              <div class="num">
                <span>￥12345.00</span>
                <div class="z-btn">立即充值</div>
              </div>
            </div>
          </div>
          <e-chart class="item"></e-chart>
          <div class="item">
            <div class="title">充值记录</div>
            <el-table

          :header-cell-style="elTableClass"
          :data="dataList"
          style="width: 100%"
        >

          <el-table-column prop="createTime" label="时间" min-width="80"></el-table-column>

          <el-table-column prop="num" label="充值金额" min-width="80"></el-table-column>
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
        </el-tab-pane>
        <el-tab-pane class="right" label="个人信息" name="2">
          <el-col class="left" :span="12">
            <div class="img"></div>
            <div class="list">
              <div class="item">姓名：王明</div>
              <div class="item">账号：123456@136.com</div>
              <div class="item">公司：杭州海翕信息科技有限公司</div>
            </div>
          </el-col>
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </z-page>
</template>
<script>
import eChart from "./echart-data.vue";
import table from "@/assets/mixin/eltable.js";
export default {
   mixins: [table],
  data() {
    return {
      index: "1",
      nowPage: 1,
      dataList: [],
      total: 0,
    };
  },
  components: {
    eChart
  },
  created() {
    this.index = this.$route.params.id || "1";
    this.getdata()
  },
  methods: {
    getdata(num){
       num ? (this.nowPage = num) : null;
      let url = `/recharge/page`
      this.$http.post(url,{
        pageNum: num || this.nowPage,
      })
      .then(res=>{
        
        if (res.code=='000000') {
          this.dataList = res.data.list;
          this.dataList.map(val => {
            val.num=JSON.parse(val.information).data.money
            val.createTime = this.gettime(val.createTime);
          });
          this.total = res.data.total;
        }
      })
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
  },
};
</script>
<style lang="less" scoped>
.left {
  padding: 48px;
  .item {
    padding-bottom: 40px;
    border-bottom: #dfe3e8 1px solid;
    &:last-child {
      border-bottom: none;
      .title {
        margin-top: 40px;
        font-size: 18px;
        line-height: 21px;
        font-weight: 600;
        color: #1e2b37;
      }
    }
    .nowMonth {
      display: inline-block;
      font-weight: 600;
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
        font-weight: 600;
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
          font-weight: 600;
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
      border-radius: 50%;
      background: #853218;
    }
    .list {
      vertical-align: top;
      display: inline-block;
      width: calc(~"100% - 195px");
      .item {
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