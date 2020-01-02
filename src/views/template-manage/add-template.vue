<template>
  <z-page :title="data.type==1?'添加模板':'修改模板'" :func="func">
    <el-row class="card">
      <el-col :span="12">
        <div class="content-item">
          <label>模板名称：</label>
          <div class="item-content">
            <el-input
              placeholder="请输入模板名称，不超过30个全角或半角字符"
              v-model="data.templateName"
              size="small"
              maxlength="30"
              show-word-limit
            ></el-input>
          </div>
        </div>

        <div class="content-item">
          <label>模板类型：</label>
          <div class="item-content">
            <el-select
            :popper-append-to-body='false'
              :disabled="data.type==2"
              style="width:100%"
              size="small"
              v-model="data.smsType"
              placeholder="请选择模板类型"
            >
              <el-option
                v-for="(item, index) in SmsTypeList"
                :key="index"
                :value="item.type"
                :label="item.name"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div v-if="data.smsType=='4'" class="content-item">
          <label>行业类型：</label>
          <div class="item-content">
            <el-select
            :popper-append-to-body='false'
              :disabled="data.type==2"
              style="width:100%"
              size="small"
              v-model="data.industryId"
              placeholder="请选择行业类型"
            >
              <el-option
                v-for="(item, index) in industryList"
                :title="item.name"
                :key="index"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </div>
        </div>

        <div class="content-item">
          <label>所属用户组：</label>
          <div class="item-content">
            <el-select :popper-append-to-body='false' style="width:100%" size="small" v-model="data.groupId" placeholder="请选择所属用户组">
              <el-option
                v-for="(item, index) in userGrounp"
                :key="index"
                :value="item.groupId"
                :label="item.groupName"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="content-item">
          <label>模板内容：</label>
          <div class="item-content">
            <el-input
              :disabled="data.type==2"
              type="textarea"
              placeholder="示例：您的验证码为：${code}，5分钟内有效，请勿泄露于他人！"
              maxlength="500"
              show-word-limit
              v-model="data.templateContent"
            ></el-input>
            <div style="padding-bottom:10px;margin-top:5px">
              快速获得可用模版，使用
            <font  @click="data.type==2?null:asd()"  :class="{disabled:data.type==2}" class="z-btn text">常用模版库</font>
            </div>
            
            <span>·&nbsp;验证码模版支持验证码作为变量；变量替换值＜＝20位数字或字母</span>
            <br />
            <span>
              ·&nbsp;不能发送营销／贷款／借款／中奖／抽奖类短信，不支持金融理财房产通知类短信（验证码除外）
            </span>
            <br />
            <span>
              ·&nbsp;
              <!-- <font class="z-btn text">签名／模版申请规范</font> -->
              签名／模版申请规范详情
            </span>
          </div>
        </div>

        <div class="content-item">
          <label>申请说明：</label>
          <div class="item-content">
            <el-input
              :disabled="data.type==2"
              type="textarea"
              placeholder="请输入描述您的业务场景"
              v-model="data.reason"
              maxlength="200"
              show-word-limit
            ></el-input>
          </div>
        </div>
        <div class="content-item">
          <label></label>
          <div class="item-content">
            <div @click="check()" style="margin-bottom:10px" class="z-btn">确&nbsp;定</div>
            <br />
            <span>·&nbsp;预计三天时间完成审核</span>
            <br />
            <span>·&nbsp;审核工作时间：周一至周五9:00-18:00（法定节假日顺延）</span>
          </div>
        </div>
      </el-col>
      <el-col :span="12" class="right">
        <div class="phone">
          <img src="/img/phone.svg" alt />
          <div class="view">
            <div class="text" v-if="data.templateContent">
              <span style="z-index:100;">【短信签名】{{data.templateContent}}</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </z-page>
</template>
<script>
export default {
  data() {
    return {
      SmsTypeList: [],
      userGrounp: [],
      saveBtn_flag:true,
      industryList: []
    };
  },
  props: {
    func: {
      type: Function
    },
    data: {}
  },
  watch: {
    //监听短信类型，如果短信类型为4 那么出现行业类型
    "data.smsType"(val) {
      if (val == "4") {
        // this.$set(this.data,'industryId','')
        this.getIndustry();
      } else {
        // this.$set(this.data,'industryId','')
      }

    }
  },
  created() {
     this.$set(this.data,'templateContent',this.data.templateContent)
    //获取短信类型
    this.$store.dispatch("getSmsType").then(res => {
      this.SmsTypeList = res;
    });
    //获取用户列表
    this.$store.dispatch("getUserGroup").then(res => {
      this.userGrounp = res;
    });
    this.getIndustry();
  },
  methods: {
      //去模板库
      asd(){
           this.$parent.pageIndex=3
      },
    //获取行业
    getIndustry() {
      let url = `/industry/all`;
      this.$http.post(url).then(res => {
        if (res.code == "000000") {
          this.industryList = res.data;
        }
      });
    },
    //保存或者修改之前
    check() {
      //必填
      let tip = {
        templateName: "模板名称",
        smsType: "模板类型",
        groupId: "所属用户组",
        
        templateContent: "模板内容",
        reason: "申请说明"
      };
      if (this.data.smsType == "4") {
        tip.industryId = "行业类型";
      }
      for (let key in tip) {
        if (!this.data[key]) {
          this.errorTip(tip[key] + "不能为空！");
          return;
        }
      }
      this.save();
    },
    //保存方法
    save() {
      if (this.saveBtn_flag) {
        this.saveBtn_flag=false
        //1 新建  2 成功修改  3失败修改
      if (this.data.type == 1) {
        let url = `/template/add`;
        this.$http
          .post(url, {
            groupId: this.data.groupId,
            industryId:
              this.data.smsType == "4" ? this.data.industryId : null,
            reason: this.data.reason,
            smsType: this.data.smsType,
            templateContent: this.data.templateContent,
            templateName: this.data.templateName
          })
          .then(res => {
            if (res.code == "000000") {
              this.successTip("添加成功");
              this.$parent.getdata(1);
              this.$parent.pageIndex = 1;
              
            } else {
              this.errorTip("添加失败");
            }
            this.saveBtn_flag=true
          });
      } else {
        if (this.data.type == 2) {
          let url = `/template/audit/update`;
          this.$http
            .post(url, {
              groupId: this.data.groupId,
              id: this.data.id,
              templateCode: this.data.templateCode,
              templateName: this.data.templateName
            })
            .then(res => {
              if (res.code == "000000") {
                this.successTip("修改成功");
                this.$parent.getdata(1);
                this.$parent.pageIndex = 1;
                
                this.$parent.$refs.multipleTable.clearSelection();
                
              } else {
                this.errorTip("修改失败");
              }
              this.saveBtn_flag=true
            });
        } else {
          let url = `/template/unAudit/update`;
          this.$http.post(url, {
              id: this.data.id,
            groupId: this.data.groupId,
            industryId:this.data.smsType == "4" ? this.data.industryId : null,
            reason: this.data.reason,
            smsType: this.data.smsType,
            templateContent: this.data.templateContent,
            templateName: this.data.templateName
          })
          .then(res=>{
              if (res.code == "000000") {
                this.successTip("修改成功");
                this.$parent.getdata(1);
                this.$parent.pageIndex = 1;
                this.$parent.$refs.multipleTable.clearSelection();
                
              } else {
                this.errorTip(res.message);
              }
              this.saveBtn_flag=true
          })
        }
      }
      }
      
    }
  }
};
</script>
<style lang="less" scoped>
@labelW: 120px;
.card {
  margin-top: 24px;
  padding-bottom: 80px;
  margin-bottom: 24px;
  .right {
    padding-top: 24px;
    display: flex;
    justify-content: center;

    .phone {
      height: 496px;
      width: 240px;
      position: relative;
      .view {
        position: absolute;
        top: 60px;
        left: 16px;
        height: 373px;
        width: 208px;
        overflow: auto;
      }
      .text {
        position: absolute;
        width: 154px;
        word-wrap: break-word;
        left: 17px;
        top: 15px;
        font-size: 14px;
        line-height: 22px;
        background: #e6e7ed;
        color: #1e2b37;
        border-radius: 8px;
        margin-bottom: 20px;
        padding: 8px;
      }
      .text::before {
        content: "";
        width: 0;
        height: 0;
        border: 5px solid;
        position: absolute;
        bottom: 5px;
        left: -10px;
        border-color: transparent #e6e7ed #e6e7ed transparent;
        z-index: 0;
      }
    }
  }
  .content-item {
    &:first-child {
      margin-top: 24px;
    }
    margin-top: 20px;
    font-size: 14px;

    > label {
      display: inline-block;
      text-align: right;
      width: @labelW;
      color: rgba(0, 0, 0, 0.85);
      vertical-align: top;
      line-height: 32px;
    }
    .item-content {
      display: inline-block;
      width: calc(~"100% - @{labelW}");
      label {
        line-height: 32px;
      }
      span {
        line-height: 20px;
        color: #99a4ad;
      }
      .normal {
        margin-left: 20px;
        vertical-align: bottom;
      }
    }
  }
}
/deep/.el-textarea {
  min-height: 0 !important;
  height: 80px !important;
  textarea {
    min-height: 0 !important;
    height: 80px !important;
  }
}
.z-btn {
  a {
    padding: 0;
    min-width: none;
    display: inline;
    color: #007ace !important;
    background: none;

    &:hover {
      color: #0097ff !important;
    }

    &:active {
      color: #005c9c !important;
    }
  }
}
/deep/.el-input__inner{
  padding-right: 45px;
}
/deep/.el-scrollbar__view .el-select-dropdown__list{
  width: 50%;
  overflow: hidden;
}
/deep/ .el-select-dropdown{
  width: 100%;
}
</style>