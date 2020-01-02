<template>
  <z-page title="短信发送记录">
    <el-row class="card">
      <div class="content">
        <div class="page-search">
          <div class="search-item">
            <label>发送日期：</label>
            <el-date-picker
              style="margin-right:48px"
              size="small"
              v-model="serchtime"
              @change="getdata(1)"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
            ></el-date-picker>
            <label>手机号码：</label>
            <el-input
              size="small"
              style="width:272px"
              v-model="phone"
              clearable
              placeholder="请输入手机号码搜索"
            ></el-input>
            <div @click="getdata(1)"  class="z-btn">搜 索</div>
          </div>
        </div>

        <el-table :header-cell-style="elTableClass" :data="dataList" style="width: 100%">
          <el-table-column prop="phoneTo" label="手机号码" min-width="80"></el-table-column>
          <el-table-column prop="sendTime" label="发送时间" min-width="120"></el-table-column>
          <el-table-column prop="smsContent"  label="发送内容" min-width="150">
            <template slot-scope="scope">
              <div :title="scope.row.smsContent"   class="smsContent">
                  {{scope.row.smsContent}}
              </div>
            </template>
            
          </el-table-column>
          <el-table-column prop="status" min-width="100">
            <template slot-scope="scope" slot="header">
              <span>
                发送结果
                <span v-if="statusSelect!=null">({{statusSelect|status}})</span>
              </span>
              <img
                style="margin-left:11px;cursor: pointer;"
                @click="sendSelect"
                src="@/assets/img/saix.svg"
                alt
              />
            </template>
            <template slot-scope="scope">
              <span
                class="status"
                :class="{green:scope.row.status==1,red:scope.row.status==2,yellow:scope.row.status==0}"
              ></span>
              &nbsp;{{scope.row.status|status}}
            </template>
          </el-table-column>
          <el-table-column prop="receiveMessage" label="接收状态" min-width="60">
            <!-- <template slot-scope="scope" slot="header">
              <span>
                接收状态
                <span v-if="statusSelect!=null">({{receiveMessage}})</span>
              </span>
              <img
                style="margin-left:11px;cursor: pointer;"
                @click="receiveSelect"
                src="@/assets/img/saix.svg"
                alt
              />
            </template> -->
            <template slot-scope="scope">
              <span
                class="status"
                :class="{green:scope.row.status==1,red:scope.row.receiveMessage=='失败',yellow:scope.row.status==0}"
              ></span>
              &nbsp;{{scope.row.receiveMessage}}
            </template>
          </el-table-column>
          <el-table-column prop="receiveDescription" label="说明" min-width="120"></el-table-column>
          <el-table-column min-width="60" label="操作">
            <template slot-scope="scope">
              <div @click="showSms(scope.row)" style="margin:0" class="z-btn text">详情</div>
            </template>
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
    </el-row>
    <sms-details v-model="detailsPop" :data="nowdata"></sms-details>
  </z-page>
</template>
<script>
import table from "@/assets/mixin/eltable.js";
//发送记录详情
import smsDetails from "./sms-details.vue";
export default {
  components: {
    smsDetails
  },
  mixins: [table],
  data() {
    return {
      detailsPop: false,
      nowdata: "",
      serchtime: [
        new Date(new Date().getTime() - 30 * 24 * 3600 * 1000),
        new Date()
      ],
      // 限制时间
      pickerOptions: {
        disabledDate: time => {
            return time.getTime() > Date.now()
        }
      },
      value2: "",
      nowPage: 1,
      dataList: [],
      total: 0,
      phone: "",
      statusSelect: null
    };
  },
  filters: {
    status(val) {
      switch (val) {
        case 1:
          return "成功";
          break;
        case 2:
          return "失败";
          break;
        case 0:
          return "发送中";
          break;
      }
    }
  },
  computed: {
    getSmsType() {
      return function(val) {
        this.SmsTypeList.map(item => {
          if (item.type == val) {
            name = item.name;
          }
        });
        return name;
      };
    }
  },

  created() {
    let g = this
    document.onkeydown=function(){
      let key = window.event.keyCode
      if (key==13) {
          g.getdata(1)
          g.$forceUpdate()
      }
    }
    if(this.$route.params.time){
        this.serchtime[0]=this.$route.params.time
        this.serchtime[1]=this.$route.params.time
    }
    //获取短信类型
    this.$store.dispatch("getSmsType").then(res => {
      this.SmsTypeList = res;
    });
    this.getdata();
  },
  methods: {
    //接收赛选
    receiveSelect(){
      switch (this.statusSelect) {
        case null:
          this.statusSelect = 1;
          break;
        case 1:
          this.statusSelect = 2;
          break;
        case 2:
          this.statusSelect = 0;
          break;
        default:
          this.statusSelect = null;
          break;
      }
    },
    //赛选
    sendSelect() {
      switch (this.statusSelect) {
        case null:
          this.statusSelect = 1;
          break;
        case 1:
          this.statusSelect = 2;
          break;
        case 2:
          this.statusSelect = 0;
          break;
        default:
          this.statusSelect = null;
          break;
      }
      this.getdata(1);
    },
    //页面切换
    handleCurrentChange(val) {
      this.nowPage = val;
      this.getdata();
    },
    //查看详情
    showSms(val) {
      this.nowdata = val;
      this.detailsPop = true;
    },
    //获取数据接口
    async getdata(num) {
      num ? (this.nowPage = num) : null;
      let url = `/result/page`;
      await this.$http
        .post(url, {
          beginTime: this.formatDateTime(this.serchtime[0]),
          endTime: this.formatDateTime(this.serchtime[1]),
          pageNum: num || this.nowPage,
          phoneTo: this.phone || null,
          status: this.statusSelect
        })
        .then(res => {
          console.log(res);

          this.dataList = res.data.list;
          this.dataList.map(val => {
            val.sendTime = this.gettime(val.sendTime);
          });
          this.total = res.data.total;
        });
    },
    formatDateTime(date) {
      if(typeof date =='object'){
        var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      var minute = date.getMinutes();
      minute = minute < 10 ? "0" + minute : minute;
      return y + "-" + m + "-" + d;
      }else{
        return date
      }
      
    },
    //处理时间
    gettime(val) {
      return val.substr(0, 10) + " " + val.substr(11, 8);
    }
  }
};
</script>
<style lang="less" scoped>
.card {
  margin-top: 24px;
  margin-bottom: 24px;
  .content {
    padding: 0px 24px 24px 24px;
    .search-item {
      &:first-child {
        margin-top: 16px;
        margin-bottom: 16px;
      }
      margin-top: 0px;
      margin-bottom: 24px;
    }
  }
}

/deep/.el-range-separator {
  width: 24px;
}
.z-btn {
  margin-left: 24px;
  vertical-align: middle;
}

/deep/.status {
  &.green {
    background: #52c41a;
  }
  &.red {
    background: #f5222d;
  }
  &.yellow {
    background: #ff7c00;
  }
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  vertical-align: middle;
}
</style>