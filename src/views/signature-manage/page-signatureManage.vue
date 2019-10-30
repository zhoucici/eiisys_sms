<template>
  <z-page v-if="pageIndex" title="签名管理">
    <el-row class="card">
      <el-tabs v-model="tabIndex" @tab-click="handleClick">
        <el-tab-pane class="content" label="短信签名" name="1">
          <div class="page-search">
            <div class="search-item">
              <label>签名内容：</label>
              <el-input clearable style="width:272px;margin-right:32px" v-model="searchText" size="small" placeholder="请输入内容搜索"></el-input>
              <div @click="getdata(1)" @clear='getdata(1)' class="z-btn">查询</div>
            </div>
            <div class="search-item">
              <div @click="addsignature()" class="z-btn">添加签名</div>
            </div>
          </div>
          <div class="page-list">
            <div class="list-head">
              <div>序号</div>
              <div>签名内容</div>
              <div>短信类型</div>
              <div>短信内容</div>
              <div>创建时间</div>
              <div>状态</div>
              <div>操作</div>
            </div>
            <div class="list-main">
              <div v-for="(item, index) in dataList" :key="index" class="list-item">
                <div>{{index+1}}</div>
                <div>{{item.signature}}</div>
                <div>{{getSmsType(item.smsType)}}</div>
                <div>{{item.smsContent}}</div>
                <div>{{item.createTime}}</div>
                <div>
                  <span class="status" :class="{green:item.examine==1,red:item.examine==2,yellow:item.examine==0}"></span>
                  &nbsp;{{item.examine|examine}}
                </div>
                <div>
                  <div @click="showsignature(item)" class="z-btn text">详情</div>
                  <div @click="addsignature(item)" v-if="item.examine==2" class="z-btn text">修改</div>
                  <div @click="del(item)" v-if="item.examine==2" class="z-btn text red">删除</div>
                </div>
              </div>
              <div style="text-align: center" v-if="dataList.length<=0" class="list-item">暂无数据</div>
            </div>
          </div>
          <el-pagination background layout="prev, pager, next" :current-page.sync="nowPage" @current-change="handleCurrentChange" v-if="total>10" :total="total"></el-pagination>
        </el-tab-pane>
        <el-tab-pane class="content" label="营业执照" name="2">
          <div class="page-search">
            <div class="search-item">
              <div @click="addfunc()" class="z-btn">添加营业执照</div>
            </div>
            <div style="margin-top:16px" class="page-list license">
              <div class="list-head">
                <div>序号</div>
                <div>签名内容</div>
                <div>操作</div>
              </div>
              <div class="list-main">
                <div v-for="(item, index) in licenseData" :key="index" class="list-item">
                  <div>{{index+1}}</div>
                  <div>{{item.name}}</div>
                  <div>
                    <div
                      @click="showLicense(item.businessLicensePic,item.name)"
                      class="z-btn text"
                    >查看</div>
                    <div @click="addfunc(item)" class="z-btn text">修改</div>
                  </div>
                </div>
                <div style="text-align: center" v-if="licenseData.length<=0" class="list-item">暂无数据</div>
              </div>
              <el-pagination background layout="prev, pager, next" :current-page.sync="nowPage" @current-change="handleCurrentChange" v-if="total>10" :total="total"></el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-row>
    <!-- 弹出框查看图片 -->
    <el-dialog class="pop" :title="nowLicenseName" :visible.sync="popFlag" width="70%" :before-close="clearPop">
      <img style="width:100%" :src="nowLicenseUrl" alt />
    </el-dialog>
    <!-- 删除提示 -->
    <el-dialog class="pop" title="提示信息" :visible.sync="delFlag" width="600px" :before-close="()=>delFlag=false">
      <div class="tip">
        <img src="@/assets/img/error.svg" alt=""> <span>是否确定删除该签名！</span>
      </div>
      <span slot="footer" class="dialog-footer">
      <div class="z-btn normal" @click="()=>delFlag=false">取 消</div>
      <div class="z-btn " @click="trueDel()">确 定</div>
    </span>
    </el-dialog>
    <add-license
      v-model="add_flag"
      @success="getLicenseData"
      :data="nowdata"
    ></add-license>
    <signature-details
      v-model="detailsPop"
      :data="nowdata"
    ></signature-details>
  </z-page>
  <add-signature  :func='func' v-else :data='nowdata'></add-signature>
</template>
<script>
import addLicense from "./add-license.vue";
import signatureDetails from "./signature-details.vue"; //签名详情
import addSignature from "./add-signature.vue";//添加签名
export default {
  data() {
    return {
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
      searchText:'',
      detailsPop:false,
      pageIndex:true,
      delFlag:false
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
  methods: {
    //要传进添加签名里面的方法
    func(){
      this.pageIndex=!this.pageIndex
    },
    //添加签名方法
    addsignature(val){
      console.log(val);
      
      if (val) {
        this.nowdata = val;
        this.nowdata.type=2
      } else {
        this.nowdata = {
          type: 1
        };
      }
      this.pageIndex=!this.pageIndex
    },
    //签名详情方法
    showsignature(val){
      this.nowdata=val
      this.detailsPop = true;
    },
    //页面切换
    handleCurrentChange(val){
          this.nowPage=val
          this.tabIndex=='1'?this.getdata():this.getLicenseData()
    },
    //切换导航栏是  页面回归1
    handleClick(){
      this.nowPage=1
    },
    //添加营业执照关闭
    add_close(val) {
      console.log(val);
    },
    addfunc(val) {
      
      if (val) {
        this.nowdata = val;
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
      this.popFlag = true;
      this.nowLicenseUrl = val;
      this.nowLicenseName = name;
    },
    //获取营业执照
    getLicenseData(num) {
      this.nowPage=num||this.nowPage
      let url = `/business/page`;
      this.$http
        .post(url, {
          pageNum: num ? num : this.nowPage
        })
        .then(res => {
          console.log(res);
          this.licenseData = res.data.list;
          this.total = res.data.total;
        });
    },
    //删除签名 仅未通过审核的才可删除
    del(val){
      this.delFlag=true
      this.nowdata=val
    },
    trueDel(){
      let url = `/signature/delete`
      this.$http.post(url,
        [this.nowdata.id]
      )
      .then(res=>{
        console.log(res);
        if(res.code=='000000'){
          this.successTip('删除成功')
          this.getdata(1)
        }
      })
    },
    //获取短信签名
    getdata(num) {
      this.nowPage=num||this.nowPage
      let url = `/signature/page`;
      this.$http
        .post(url, {
          signature:this.searchText||null,
          pageNum: num ? num : this.nowPage
        })
        .then(res => {
          console.log(res);
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
  .content {
    padding: 0px 24px 24px 24px;
    .search-item {
      &:first-child {
        margin: 0;
      }
      margin-top: 16px;
      margin-bottom: 24px;
    }
    height: 700px;
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
        &:nth-child(7){
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
</style>