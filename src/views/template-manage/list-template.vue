<template>
  <z-page title="常用模板库" :func="func">
    <el-row class="card">
      <el-table :span-method="arraySpanMethod" :header-cell-style="elTableClass" :data="dataList" style="width: 100%">
        <el-table-column label="模板分类" min-width="30">
            <template slot-scope="scope">{{getSmsType(scope.row.smsType)}}</template>
        </el-table-column>
        <el-table-column prop="content" label="内容" min-width="120"></el-table-column>
        <el-table-column min-width="30" label="操作">
          <template slot-scope="scope">
            <div @click="useT(scope.row)" style="margin:0" class="z-btn text">使用此模板</div>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </z-page>
</template>
<script>
import table from "@/assets/mixin/eltable.js";
export default {
    mixins: [table],
  props: {
    func: {}
  },
  data(){
      return{
          dataList:[],
          typeNum:[]
      }
      
  },
  computed: {
    getSmsType() {
      
      return function(val) {
        let name='--'
        this.SmsTypeList.map(item => {
          if (item.type == val) {
            name = item.name;
          }
        })
        return name;
      };
    }
  },
  created() {
      //获取短信类型
      
    this.$store.dispatch("getSmsType").then(res => {
      this.SmsTypeList = res;
      this.getdata();
    });
    
    
  },
  methods: {
      arraySpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
            let flag
            for (let index = 0; index < this.dataList.length; index++) {
                if ((rowIndex==0)||this.dataList[rowIndex].smsType!=this.dataList[rowIndex-1].smsType) {
                    flag=true
                    break;
                }
                
            }
          if (flag) {
            // console.log(this.typeNum[row.smsType]);
            
            return {
              rowspan:this.typeNum[row.smsType],
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },
      useT(val){
          this.$parent.nowdata.templateContent =  JSON.parse(JSON.stringify(val.content))  
          this.$parent.pageIndex = 2;
      },
    getdata() {
      let url = `/templateExample/all`;
      this.$http.post(url).then(res => {
        console.log(res);
        if(res.code=='000000'){
            this.dataList=res.data
            function sortId(a, b) {
            return a.smsType - b.smsType;
          }
          this.dataList.sort(sortId)
            this.dataList.map(val=>{
                this.typeNum[val.smsType]?this.typeNum[val.smsType]++:this.typeNum[val.smsType]=1
            }) 
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.card {
  margin-top: 24px;
  margin-bottom: 24px;
  padding: 24px
}
</style>