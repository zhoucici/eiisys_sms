<template>
  <z-page v-if="pageIndex" title="签名管理">
    <el-row class="card">
      <z-tabTop :barLen="100" width="110px" v-model="tabIndex" :titleArr="tab_title"></z-tabTop>
      <div class="content" v-if="tabIndex=='1'">
        <div class="page-search">
          <div class="search-item">
            <label>签名内容：</label>
            <el-input
              clearable
              style="width:272px;margin-right:32px"
              v-model="searchText"
              size="small"
              placeholder="请输入签名内容搜索"
            ></el-input>
            <div @click="getdata(1)" @clear="getdata(1)" class="z-btn">查询</div>
          </div>
          <div class="search-item">
            <div @click="addsignature()" class="z-btn">添加签名</div>
          </div>
        </div>

        <el-table :header-cell-style="elTableClass" :data="dataList" style="width: 100%">
          <el-table-column type="index" label="序号" min-width="80"></el-table-column>
          <el-table-column prop="signature" label="签名内容" min-width="80"></el-table-column>
          <el-table-column prop="phoneAmount" label="短信类型" min-width="125">
            <template slot-scope="scopeu8tr54" slot="header">
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
          <el-table-column  prop="smsContent" label="短信内容" min-width="150">
            <template slot-scope="scope">
              <div :title="scope.row.smsContent"   class="smsContent">
                  {{scope.row.smsContent}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="150"></el-table-column>
          <el-table-column prop="createTime" label="状态" min-width="80">
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
          <el-table-column min-width="85" label="操作">
            <template slot-scope="scope">
              <div @click="showsignature(scope.row)" class="z-btn text">详情</div>
              <div
                @click="scope.row.examine==2&&addsignature(scope.row)"
                :class="{disabled:scope.row.examine!=2}"
                class="z-btn text"
              >修改</div>
              <div @click="scope.row.examine==2&&del(scope.row)"  :class="{disabled:scope.row.examine!=2}"  class="z-btn text red">删除</div>
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
      <div class="content" v-if="tabIndex=='2'">
        <div class="page-search">
          <div class="search-item">
            <div @click="addfunc()" class="z-btn">添加营业执照</div>
          </div>

          <el-table :header-cell-style="elTableClass" :data="licenseData" style="width: 100;margin-top:24px">
            <el-table-column type="index"  width="150" label="序号" ></el-table-column>
            <el-table-column prop="name" label="公司名称" ></el-table-column>
            <el-table-column  label="操作" width="100" fixed="right">
              <template slot-scope="scope">
                <div
                  @click="showLicense(scope.row.businessLicensePic,scope.row.name)"
                  class="z-btn text"
                >查看</div>
                <div @click="addfunc(scope.row)" class="z-btn text">修改</div>
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
      </div>
    </el-row>
    <!-- 弹出框查看图片 -->
    <el-dialog
      class="pop"
      :title="nowLicenseName"
      :visible.sync="popFlag"
      width="600px"
      height='538px'
      :before-close="clearPop"
    >
    <div class="LicenseImg">
      <img style="width:100%" :src="nowLicenseUrl" alt />
    </div>
          
    </el-dialog>
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
        <span>是否确定删除该签名！</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <div class="z-btn" @click="trueDel()">确 定</div>
        <div class="z-btn normal" @click="()=>delFlag=false">取 消</div>
      </span>
    </el-dialog>
    <add-license v-model="add_flag" @success="getLicenseData" :data="nowdata"></add-license>
    <signature-details v-model="detailsPop" :data="nowdata"></signature-details>
  </z-page>
  <add-signature :func="func" v-else :data="nowdata"></add-signature>
</template>
<script>
import addLicense from "./add-license.vue";
import signatureDetails from "./signature-details.vue"; //签名详情
import addSignature from "./add-signature.vue"; //添加签名
import table from "@/assets/mixin/eltable.js";
export default {
  mixins: [table],
  data() {
    return {
      statusSelect:null,
      tabIndex: "1",
      dataList: [],
      licenseData: [],
      total: 0,
      nowPage: 1,
      SmsTypeList: [],
      popFlag: false,
      nowLicenseUrl: "",
      nowLicenseName: "",
      add_flag: false,
      nowdata: {},
      searchText: "",
      detailsPop: false,
      pageIndex: true,
      delFlag: false,
      typeSelect:null
    };
  },
  components: {
    addLicense,
    signatureDetails,
    addSignature
  },
  watch: {
    tabIndex(val) {
      this.nowPage = 1;
      if (val == "1") {
        this.getdata();
      } else {
        this.getLicenseData();
      }
    }
  },

   created() {
    //获取短信类型
    this.$store.dispatch("getSmsType").then(res => {
      this.SmsTypeList = res;
    });
    this.getdata();
    let g = this
    document.onkeydown=function(){
      let key = window.event.keyCode
      if (key==13) {
          g.getdata(1)
          g.$forceUpdate()
      }
    }
  },
  computed: {
    getSmsType() {
      return function(val) {
        let name 
        this.SmsTypeList.map(item => {
          if (item.type == val) {
            name = item.name;
          }
        });
        return name;
      };
    },
    tab_title() {
      return [
        {
          name: "短信签名",
          index: "1"
        },
        {
          name: "营业执照",
          index: "2"
        }
      ];
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
    //要传进添加签名里面的方法
    func() {
      this.pageIndex = !this.pageIndex;
      this.getdata(1);
    },
    //添加签名方法
    addsignature(val) {
      if (val) {
        this.nowdata = val;
        this.nowdata.type = 2;
      } else {
        this.nowdata = {
          type: 1
        };
      }
      this.pageIndex = !this.pageIndex;
    },
    //签名详情方法
    showsignature(val) {
      this.nowdata = val;
      this.detailsPop = true;
    },
    //页面切换
    handleCurrentChange(val) {
      this.nowPage = val;
      this.tabIndex == "1" ? this.getdata() : this.getLicenseData();
    },
    //切换导航栏是  页面回归1
    handleClick() {
      this.nowPage = 1;
    },
    //添加营业执照关闭
    add_close(val) {},
    addfunc(val) {
      if (val) {
        this.nowdata = JSON.parse(JSON.stringify(val)) ;
      } else {
        this.nowdata = {
          type: 1
        };
      }

      this.add_flag = true;
    },
    //关闭详情
    clearPop() {
      this.popFlag = false;
      this.nowLicenseUrl = "";
    },
    //查看详情
    showLicense(val, name) {
      console.log(val);
      
      this.popFlag = true;
      this.nowLicenseUrl = val;
      this.nowLicenseName = name;
    },
    //获取营业执照
    getLicenseData(num) {
      this.nowPage = num || this.nowPage;
      let url = `/business/page`;
      this.$http
        .post(url, {
          pageNum: num ? num : this.nowPage
        })
        .then(res => {
          this.licenseData = res.data.list;
          this.total = res.data.total;
        });
    },
    //删除签名 仅未通过审核的才可删除
    del(val) {
      this.delFlag = true;
      this.nowdata = val;
    },
    trueDel() {
      let url = `/signature/delete`;
      this.$http.post(url, [this.nowdata.id]).then(res => {
        if (res.code == "000000") {
          this.delFlag=false;
          this.successTip("删除成功");
          this.getdata(1);
        }
      });
    },
    //获取短信签名
    getdata(num) {
      this.nowPage = num || this.nowPage;
      let url = `/signature/page`;
      this.$http
        .post(url, {
          signature: this.searchText || null,
          pageNum: num ? num : this.nowPage,
          examine:this.statusSelect,
          smsType:this.typeSelect?this.SmsTypeList[this.typeSelect-1].type:undefined
        })
        .then(res => {
          this.dataList = res.data.list;
          this.total = res.data.total;
        });
    }
  }
};
</script>
<style lang="less" scoped>
.card {
  margin-top: 24px;
  margin-bottom: 24px;
  .content {
    padding: 24px 24px 24px 24px;
    .search-item {
      &:first-child {
        margin: 0;
      }
      margin-top: 16px;
      
      margin-bottom: 24px;
    }
  }
  .page-list {
    .list-head,
    .list-item {
      > div {
        &:nth-child(1),
        &:nth-child(6),
        &:nth-child(7) {
          width: 8%;
        }
        &:nth-child(2),
        &:nth-child(3),
        &:nth-child(7) {
          width: 13%;
        }
        &:nth-child(4),
        &:nth-child(5) {
          width: 22%;
        }
      }
    }
    &.license {
      .list-head,
      .list-item {
        > div {
          &:nth-child(1) {
            width: 30%;
          }
          &:nth-child(2) {
            width: 60%;
          }
          &:nth-child(3) {
            width: 10%;
          }
        }
      }
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

  .LicenseImg{
    max-height: 490px;
    overflow: auto;
  }

</style>