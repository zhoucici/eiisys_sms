<template>
  <z-page title="费用统计">
    <el-row class="card">
      <div class="content">
        <div class="page-search">
          <div class="search-item long">
            <label>统计月份：</label>
            <el-date-picker
            @change="getdata()"
              v-model="serchtime"
              type="month"
              size="small"
              placeholder="选择统计月份"
              format="yyyy-MM"
              value-format="yyyyMM"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </div>
        </div>

        <el-table :header-cell-style="elTableClass" :data="dataList" style="width: 100%">
          <el-table-column prop="smsType" label="短信类型" min-width="50">
              <template slot-scope="scope">
              <div >  {{getSmsType( scope.row.smsType)}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="danj" label="计费单位（元/条）"  align="right" min-width="120">
            <template slot-scope="scope">
              <div @change="asd(scope)" style="text-align: right">{{(scope.row.smsType==4?'--': (scope.row.unitPrice?scope.row.unitPrice/1000:''))}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="num" label="计费量（条）" align="right" min-width="120">
            <template slot-scope="scope">
              <div style="text-align: right">{{scope.row.smsAmount}}</div>
            </template>
          </el-table-column>
          <el-table-column  label="金额（元）" align="right" min-width="120">
            <template slot-scope="scope">
              <div style="text-align: right">{{scope.row.deduction}}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-row>
  </z-page>
</template>
<script>
import table from "@/assets/mixin/eltable.js";
export default {
   mixins: [table],
  data() {
    function gettime(val) {
      
      return val.toISOString().substr(0, 7) .replace('-','')
    }
    return {
      serchtime: gettime(new Date()),
      dataList:[],
      // 限制时间
      pickerOptions: {
        onPick: time => {
          this.timeOptionRange = time.minDate;
        },
        disabledDate: time => {

            return time.getTime() > Date.now();
          
        }
      },
    };
  },
  computed: {
    getSmsType() {
      return function(val) {
        let name = ''
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
    //获取短信类型
    this.$store.dispatch("getSmsType").then(res => {
      this.SmsTypeList = res;
      this.getdata()
    });
    
  },
  methods: {
    asd(val){
      console.log(val);
      
    },
      getdata(){
          let url = `deduction/list`
          this.$http.post(url,
              this.serchtime
        )
          .then(res=>{
              if (res.code=='000000') {
                let arr=[]
                res.data.map(val=>{
                  arr[val.smsType-1]=val
                })
                 arr[4]={
                   deduction:0,
                   smsAmount:0
                 }
                arr.map((val,i)=>{
                  if (i<4) {
                    arr[i].deduction=arr[i].deduction/1000
                      arr[4].deduction+=val.deduction
                      arr[4].smsAmount+=val.smsAmount
                  }
                  
                })
                  arr[4].deduction='总计：'+arr[4].deduction.toFixed(2)
                 arr[4].smsAmount='总计：'+arr[4].smsAmount
                this.dataList=arr
                
              }
          })
      }
  },
};
</script>
<style lang="less" scoped>
.card {
  
  margin-top: 24px;
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
</style>