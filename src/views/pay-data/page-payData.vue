<template>
  <z-page title="费用统计">
    <el-row class="card">
      <div class="content">
        <div class="page-search">
          <div class="search-item">
            <label>发送日期：</label>
            <el-date-picker
            @change="getdata()"
              v-model="serchtime"
              type="date"
              size="small"
              placeholder="选择日期"
              format="yyyy-MM"
              value-format="yyyy-MM"
            ></el-date-picker>
          </div>
        </div>

        <!-- <el-table :header-cell-style="elTableClass" :data="dataList" style="width: 100%">
          <el-table-column prop="phoneTo" label="手机号码" min-width="120"></el-table-column>
          <el-table-column prop="sendTime" label="发送时间" min-width="120"></el-table-column>
          <el-table-column prop="groupName" label="发送内容" min-width="90"></el-table-column>
          <el-table-column prop="status" label="发送状态" min-width="120"></el-table-column>
          <el-table-column prop="sendTime" label="接收状态" min-width="120"></el-table-column>
          <el-table-column prop="sendTime" label="错误码" min-width="120"></el-table-column>
          <el-table-column prop="sendTime" label="错误原因" min-width="120"></el-table-column>
          <el-table-column min-width="60" label="操作">
            <template slot-scope="scope">
              <div  @click="showSms(scope.row)"  style="margin:0" class="z-btn text">详情</div>
            </template>
          </el-table-column>
        </el-table>-->
      </div>
    </el-row>
  </z-page>
</template>
<script>
export default {
  data() {
    return {
      serchtime: ""
    };
  },
  methods: {
      getdata(){
          let url = `deduction/list`
          this.$http.post(url,{
              date:this.serchtime
          })
          .then(res=>{
              console.log(res);
            
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