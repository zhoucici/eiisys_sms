<template>
  <z-page title="发送量统计">
    <el-row class="card">
      <div class="content">
        <div class="page-search">
          <div class="search-item">
            <label>短信类型：</label>
            <el-select  size="small" v-model="smsType" placeholder="请选择">
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
                style="margin-left:10px"
                v-model="searchTime"
                size="small"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
          </div>
        </div>
        <Gchart :list='dataList'></Gchart>
        <el-table :header-cell-style="elTableClass" :data="dataList" style="width: 100%">
          <el-table-column prop="time" label="统计时间" min-width="80"></el-table-column>
          <el-table-column prop="send" label="发送总数（条）" min-width="120"></el-table-column>
          <el-table-column prop="success" label="发送成功条数（条）" min-width="150"></el-table-column>
          <el-table-column prop="fail" label="发送成功率（%）" min-width="150"></el-table-column>
          <el-table-column min-width="60" label="操作">
            <template slot-scope="scope">
              <div @click="showSms(scope.row)" style="margin:0" class="z-btn text">详情</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      
      
    </el-row>
  </z-page>
</template>
<script>
import table from "@/assets/mixin/eltable.js";
import Gchart from '@/components/data-chart.vue'
export default {
     mixins: [table],
     components:{
         Gchart
     },
  data() {
    return {
      dataList: [],
      chartType: "1", //1 7天 2 31天 3 自定义
      smsType:'',
      SmsTypeList:[],
      searchTime:'',
      chartData:[]
    };
  },
  created() {
      //获取短信类型
    this.$store.dispatch("getSmsType").then(res => {
      this.SmsTypeList = res;
      this.smsType=this.SmsTypeList[0].id
      this.getdata()
    });
  },
  methods: {
    getdata() {
        let url = `/statistics/day/map`
        let obj = {
            beginTime:'20191011',
            endTime:'20191018',
            smsType:this.smsType
        }
        
        switch (this.chartType) {
            case '1':
                obj.beginTime=new Date(new Date() .getTime() -7*24*3600*1000) .toISOString().substr(0,10).replace(/-/g,"")
                OBJ.endTime=new Date() .toISOString().substr(0,10).replace(/-/g,"")
                break;
        
            default:
                break;
        }
        this.$http.post(url,obj)
        .then(res=>{
            let arr=[]
            if (res.code=='000000') {
                this.chartData=res.data
                for (const key in res.data) {
                    let obj={}
                    obj.time=  key.slice(0,4)+'-'+key.slice(4,6)+'-'+key.slice(6)
                    for (const value in res.data[key]) {
                        obj[value]= res.data[key][value]
                    }
                    arr.push(obj)
                }
                
                this.dataList=arr
                
            }
        })
    }
  }
};
</script>
<style lang="less" scoped>
    .card{
        padding: 24px;
    }
</style>