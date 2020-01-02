<template>
  <z-page v-if="pageIndex==1" title="模板管理">
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
              placeholder="请输入模板名称搜索"
            ></el-input>
            <div @click="getdata(1)" @clear="getdata(1)" class="z-btn">查询</div>
          </div>
          <div class="search-item">
            <div @click="addTemplate()" class="z-btn">添加模板</div>
            <div v-if="ids.length> 0" @click="delopen()" class="z-btn red">删 除</div>
          </div>
        </div>
        <el-table
          ref="multipleTable"
          row-key="id"
          :header-cell-style="elTableClass"
          @selection-change="handleSelectionChange"
          :data="dataList"
          style="width: 100%"
        >
          <el-table-column
            :selectable="selectAble"
            :disabled='true'
            :reserve-selection="true"
            type="selection"
            width="45"
          ></el-table-column>
          <el-table-column prop="templateCode" label="业务编号" min-width="120">
            <!-- <template slot-scope="scope">{{ scope.row.date }}</template> -->
          </el-table-column>
          <el-table-column  prop="templateName" label="模板名称" min-width="80">
            <template slot-scope="scope">
              <div :title="scope.row.templateName"   class="smsContent">
                  {{scope.row.templateName}}
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="115">
           <template slot-scope="scope" slot="header">
              <span>
                短信类型
                <span v-if="typeSelect!=null" >({{getSmsType(typeSelect)}})</span>
              </span>
              <img
                style="margin-left:11px;cursor: pointer;"
                @click="sendTypeSelect"
                src="@/assets/img/saix.svg"
                alt
              />
            </template>
            <template slot-scope="scope">{{getSmsType(scope.row.smsType)}}</template>
          </el-table-column>
          <el-table-column prop="groupName" label="所属用户组" min-width="80"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="80"></el-table-column>
          <el-table-column min-width="80" label="状态">
            <template slot-scope="scope" slot="header">
              <span>
                状态
                <span v-if="statusSelect!=null">({{statusSelect|examine}})</span>
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
                :class="{green:scope.row.examine==1,red:scope.row.examine==2,yellow:scope.row.examine==0}"
              ></span>
              &nbsp;{{scope.row.examine|examine}}
            </template>
          </el-table-column>
          <el-table-column min-width="80" label="操作">
            <template slot-scope="scope">
              <div @click="showTemplate(scope.row)" class="z-btn text">详情</div>
              <div
                @click="scope.row.examine==0?null:addTemplate(scope.row)"
                :class="{disabled:scope.row.examine==0}"
                class="z-btn text"
              >修改</div>
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
    <template-details v-model="detailsPop" :data="nowdata"></template-details>
    <!-- 删除提示 -->
    <el-dialog
    top='30vh'
      class="pop"
      title="提示信息"
      :visible.sync="delFlag"
      width="600px"
      :before-close="()=>delFlag=false"
    >
      <div class="tip">
        <img src="@/assets/img/error.svg" alt />
        <span>确定删除选中模版？</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <div class="z-btn" @click="trueDel()">确 定</div>
        <div class="z-btn normal" @click="()=>delFlag=false">取 消</div>
        
      </span>
    </el-dialog>
  </z-page>
  <add-template v-else-if="pageIndex==2" :func="func" :data="nowdata"></add-template>
  <list-template v-else :func="gotolistfunc"></list-template>
</template>
<script>
import table from "@/assets/mixin/eltable.js";
//添加
import addTemplate from "./add-template.vue";
//模板库
import listTemplate from "./list-template.vue";
//模板详情
import templateDetails from "./template-details.vue";
export default {
  mixins: [table],
  data() {
    return {
      statusSelect:null,  //赛选状态
      pageIndex: 1, // 1  模板管理  2 添加模板  3  常用模板库
      searchText: "",
      nowPage: 1,
      dataList: [],
      total: 0,
      nowdata: "",
      SmsTypeList: [],
      detailsPop: false,
      ids: [],
      delFlag: false,
      typeSelect:null
    };
  },
  components: {
    addTemplate,
    listTemplate,
    templateDetails
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
    let g = this
    document.onkeydown=function(){
      let key = window.event.keyCode
      if (key==13) {
          g.getdata(1)
          g.$forceUpdate()
      }
    }
  },
  methods: {
    //短信类型赛选方法
    sendTypeSelect(){

    if (!this.typeSelect) {
        this.typeSelect=1
    }else if(this.typeSelect<(this.SmsTypeList.length)){
      this.typeSelect++
    }else if(this.typeSelect==(this.SmsTypeList.length)){
      this.typeSelect=null
    }
    this.getdata(1);
    },
    //赛选方法
    sendSelect(){
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
    // 选择时改变容器
    handleSelectionChange(val) {
      this.ids = val;
    },
    //赛选是否能够选择
    selectAble(val, index) {
      if (val.examine == "2") {
        return true;
      }
      return false;
    },
    //打开删除提示2
    delopen() {
      console.log(this.ids);
      if (this.ids.length <= 0) {
        this.errorTip("你没有选择模板！");
        return;
      }
      this.delFlag = true;
    },
    trueDel() {
      let nums = [];
      this.ids.map(val => {
        nums.push(val.templateCode);
      });
      let url = `/template/delete`;
      this.$http.post(url, nums).then(res => {
        console.log(res);
        if (res.code == "000000") {
          this.successTip("删除成功！");
          this.delFlag = false;
          this.getdata(1);
          this.$refs.multipleTable.clearSelection();
        }
      });
    },
    //查看模板详情
    showTemplate(val) {
      console.log(val);
      
      this.nowdata = val;
      this.detailsPop = true;
    },
    //页面切换
    handleCurrentChange(val) {
      this.nowPage = val;
      this.$refs.multipleTable.clearSelection();
      this.getdata();
    },
    //要传进添加签名里面的方法
    func() {
      this.pageIndex = 1;
      this.$refs.multipleTable&&this.$refs.multipleTable.clearSelection();
    },
    gotolistfunc() {
      this.pageIndex = 2;
    },
    //添加模板
    //1 新建  2 成功修改  3失败修改
    addTemplate(val) {
      if (val) {
        console.log(val);
        
        this.nowdata = val;
        this.nowdata.examine == 2
          ? (this.nowdata.type = 3)
          : (this.nowdata.type = 2);
          this.nowdata.industryId==0?this.nowdata.industryId='':this.nowdata.industryId
      } else {
        this.nowdata = {
          type: 1
        };
      }
      this.pageIndex = 2;
    },
    //获取数据接口
    getdata(num) {
      num ? (this.nowPage = num) : null;
      let url = `/template/page`;
      this.$http
        .post(url, {
          pageNum: num || this.nowPage,
          templateName: this.searchText,
          examine:this.statusSelect,
          smsType:this.typeSelect?this.SmsTypeList[this.typeSelect-1].type:undefined
        })
        .then(res => {
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
.content{
  /deep/.el-checkbox__input.is-disabled .el-checkbox__inner{
    cursor: pointer;
  }
}
</style>