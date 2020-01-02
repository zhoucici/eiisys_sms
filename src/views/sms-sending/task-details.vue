<template>
  <z-page title="任务详情" :func="func">
    <el-row class="card">
      <div class="datalist">
        <div>
          <label>短信签名：</label>
          <span>{{nowdata.signature}}</span>
        </div>
        <div>
          <label>短信模板：</label>
          <span>{{nowdata.templateName}}</span>
        </div>
        <div>
          <label>短信全文：</label>
          <span>【{{nowdata.signature}}】{{nowdata.templateContent}}</span>
        </div>
        <div>
          <label>号码数量：</label>
          <span>{{nowdata.phoneAmount}}</span>
        </div>
        <div>
          <label>计费条数：</label>
          <span>{{nowdata.payAmount}}</span>
        </div>
      </div>
      <div class="dataview">
        <div class="item">
          <span>发送总数（条）</span>

          <font>{{nowdata.smsAmount}}</font>
        </div>
        <div class="item">
          <span>发送中（条）</span>
          <font>{{  nowdata.smsAmount -nowdata.receiveAmount-nowdata.failAmount}}</font>
        </div>
        <div class="item">
          <span>发送成功（条）</span>
          <font>{{nowdata.receiveAmount}}</font>
        </div>
        <div class="item">
          <span>发送失败（条）</span>
          <font>{{nowdata.failAmount}}</font>
        </div>
      </div>
      <div class="table">
        <el-input style="width:272px"  v-model="phone" size="small" placeholder="请输入接收号码搜索"></el-input>
        <div @click="getdata(1)"   class="z-btn">查 询</div>
        <div @click="download" style="float:right" class="z-btn">下载失败名单</div>
        <el-table
          :header-cell-style="elTableClass"
          :data="dataList"
          style="width: 100%;margin-top:24px;"
        >
          <el-table-column prop="phoneTo" label="接收号码" min-width="80"></el-table-column>
          <el-table-column prop="sendTime" label="发送时间" min-width="120"></el-table-column>
          <el-table-column prop="receiveMessage" label="发送结果" min-width="120">
            <template slot-scope="scope">{{scope.row.receiveMessage||'--'}}</template>
          </el-table-column>
          <el-table-column prop="receiveStatus" label="状态码" min-width="120">
            <template slot-scope="scope">{{scope.row.receiveStatus||'--'}}</template>
          </el-table-column>
          <el-table-column prop="receiveDescription" label="说明" min-width="150">
            <template slot-scope="scope">{{scope.row.receiveDescription||'--'}}</template>
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
  </z-page>
</template>
<script>
import table from "@/assets/mixin/eltable.js";
import axios from "axios"
export default {
  mixins: [table],
  data() {
    return {
      dataList: [],
      nowPage: 1,
      total: 0,
      nowdata:{},
      phone:''
    };
  },
  props: {
    func: {
      type: Function
    },
    data: {}
  },

  created() {
    
    this.getinfo();
    this.getdata()
    let g = this
    document.onkeydown=function(){
      let key = window.event.keyCode
      if (key==13) {
          g.getdata(1)
      }
    }
  },
  methods: {
    asd(e){
      console.log(e);
      
    },
    //下载失败名单
    download(){
      console.log(this.data);
      
      let url = `/result/downloadFail`



      axios({
        method: 'post',
        url: this.$url.eiisys_sms +'/sms/result/downloadFail',
        headers:{
          'x-access-token':sessionStorage.getItem('x-access-token')
        },
        data: {
          date:this.data.sendTime.substr(0,10),
            taskId:this.data.id,
        },
        responseType: 'blob'
      })  
      .then(res=>{
      let blob = new Blob([res.data])
      let fileName = 'fail.csv'
      if ('download' in document.createElement('a')) { // 不是IE浏览器
        let url = window.URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link) // 下载完成移除元素
        window.URL.revokeObjectURL(url) // 释放掉blob对象
      } else { // IE 10+
        window.navigator.msSaveBlob(blob, fileName)
      }

      })
      
    },
    getinfo() {
      let url = `/send/task/info`;
      this.$http.post(url, this.data.id).then(res => {
        console.log(res);
        
        this.nowdata=res.data
        
      });
    },
    getdata(num) {
      num ? (this.nowPage = num) : null;
      let url = `/result/page`;
      this.$http
        .post(url, {
          beginTime: this.data.sendTime.substr(0,10),
          endTime: this.formatDateTime(new Date()),
          taskId:this.data.id,
          pageNum: num || this.nowPage,
          phoneTo:this.phone||null
        })
        .then(res => {
          console.log(res);
          this.dataList = res.data.list;
          this.dataList.map(val => {
            
            // val.sendTime = this.gettime(val.sendTime);
          });
          this.total = res.data.total;
        });
    },
    //页面切换
    handleCurrentChange(val) {
      this.nowPage = val;
      this.getdata();
    },
    formatDateTime(date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      var minute = date.getMinutes();
      minute = minute < 10 ? "0" + minute : minute;
      return y + "-" + m + "-" + d;
    },
  }
};
</script>
<style lang="less" scoped>
.card {
  margin: 24px 0px;
  padding: 32px 24px;
  .datalist {
    > div {
      margin-bottom: 8px;
    }
  }
  .dataview {
    margin-top: 32px;
    height: 104px;
    background: #f9f9fa;
    border-radius: 3px;
    .item {
      display: inline-block;
      width: 25%;
      text-align: center;
      line-height: 104px;

      span {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.65);
        vertical-align: middle;
      }
      font {
        font-size: 24px;
        vertical-align: middle;
        color: #007ace;
      }
    }
  }
  .table {
    margin-top: 24px;
    .z-btn {
      margin-left: 16px;
      vertical-align: middle;
    }
  }
}
</style>