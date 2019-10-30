<template>
  <z-page title="模板管理">
    <el-row class="card">
      <div class="content">
        <div class="page-search">
          <div class="search-item">
            <label>模板名称：</label>
            <el-input
              clearable
              style="width:272px;margin-right:32px"
              v-model="searchText"
              size="small"
              placeholder="请输入内容搜索"
            ></el-input>
            <div @click="getdata(1)" @clear="getdata(1)" class="z-btn">查询</div>
          </div>
          <div class="search-item">
            <div @click="addTemplate()" class="z-btn">添加模板</div>
          </div>
        </div>
        <el-table :header-cell-style='elTableClass' :data="dataList" style="width: 100%">
          <el-table-column type="selection" width="45"></el-table-column>
          <el-table-column prop="templateCode" label="业务编号" min-width="120">
            <!-- <template slot-scope="scope">{{ scope.row.date }}</template> -->
          </el-table-column>
          <el-table-column prop="templateName" label="模板名称" min-width="80"></el-table-column>
          <el-table-column min-width="80" label="模板类型">
            <template slot-scope="scope">{{getSmsType(scope.row.smsType)}}</template>
          </el-table-column>
          <el-table-column prop="groupName" label="所属用户组" min-width="80"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="80"></el-table-column>
          <el-table-column  min-width="80"  label="状态" >
            <template slot-scope="scope"><span
                  class="status"
                  :class="{green:scope.row.examine==1,red:scope.row.examine==2,yellow:scope.row.examine==0}"
                ></span>
                &nbsp;{{scope.row.examine|examine}}</template>
          </el-table-column>
          <el-table-column min-width="80" label="操作" >
            <template slot-scope="scope">
              <div @click="showTemplate(scope.row)" class="z-btn text">详情</div>
                <div @click="addTemplate(scope.row)"  :class="{disabled:scope.row.examine==0}" class="z-btn text">修改</div>
            </template>
          </el-table-column>
        </el-table>

      </div>
    </el-row>
  </z-page>
</template>
<script>
import table from '@/assets/mixin/eltable.js'
export default {
  mixins: [table],
  data() {
    return {
      searchText: "",
      nowPage: 1,
      dataList: [],
      total: 0,
      nowdata:'',
      SmsTypeList: []
    };
  },
  computed: {
    getSmsType() {
      return function(val) {
        this.SmsTypeList.map(item => {
          if (item.id == val) {
            name = item.name;
          }
        });
        return name;
      };
    }
  },
  filters: {
    examine(val) {
      switch (val) {
        case 1:
          return "通过";
          break;
        case 2:
          return "失败";
          break;
        case 0:
          return "审核中";
          break;
      }
    }
  },
  created() {
    //获取短信类型
    this.$store.dispatch("getSmsType").then(res => {
      this.SmsTypeList = res;
    });
    this.getdata(1);
  },
  methods: {
    //添加模板
    addTemplate(val){
      if (val) {
        this.nowdata = val;
      } else {
        this.nowdata = {
          type: 1
        };
      }

      this.add_flag = true;
    },
    //获取数据接口
    getdata(num) {
      num ? (this.nowPage = num) : null;
      this.nowPage;
      let url = `/template/page`;
      this.$http
        .post(url, {
          pageQuery: num || this.nowPage,
          templateName: this.searchText
        })
        .then(res => {
          console.log(res);
          this.dataList = res.data.list;
          this.dataList.map(val => {
            val.createTime = this.gettime(val.createTime);
          });
          this.total = res.data.total;
        });
    },
    //处理时间
    gettime(val) {
      return val.substr(0, 10);
    }
  }
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