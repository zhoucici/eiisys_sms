<template>
  <z-page title="添加签名" :func="func">
    <el-row class="card">
      <el-col :span="12">
        <div class="content-item">
          <label>签名内容：</label>
          <div class="item-content">
            <el-input
              placeholder="2-8个字符，建议为用户真实应用名/网站名/公司名"
              v-model="data.signature"
              size="small"
              maxlength="8"
              show-word-limit
            ></el-input>

            <span>·&nbsp;必须含中文，可以包含数字、英文</span>
            <br />
            <span>·&nbsp;若签名／模板内容侵犯到第三方权益必须获得第三方真实授权</span>
            <br />
            <span>·&nbsp;无需添加【】、（）、[]符号，签名发送会自带【】符号，避免重复</span>
            <br />
            <span>
              ·&nbsp;
              <font class="z-btn text">签名／模版申请规范</font>详情
            </span>
            <br />
          </div>
        </div>
        <div class="content-item">
          <label>短信类型：</label>
          <div class="item-content">
            <el-select style="width:100%" size="small" v-model="data.smsType" placeholder="请选择">
              <el-option
                v-for="(item, index) in SmsTypeList"
                :key="index"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div v-if="data.smsType=='4'" class="content-item">
          <label>行业类型：</label>
          <div class="item-content">
            <el-select style="width:100%" size="small" v-model="data.industryId" placeholder="请选择">
              <el-option
                v-for="(item, index) in industryList"
                :key="index"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="content-item">
          <label>营业执照：</label>
          <div class="item-content">
            <el-select
              style="width:100%"
              size="small"
              v-model="data.businessLicenseId"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in licenseList"
                :key="index"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
            <span>
              ·&nbsp;没有需要的营业执照？
              <font @click='addlincense' class="z-btn text">添加营业执照</font>
            </span>
            <br />
          </div>
        </div>
        <div class="content-item">
          <label>公司名：</label>
          <div class="item-content">
            <el-input v-model="data.enterpriseName" placeholder="请输入公司名称" size="small"></el-input>
          </div>
        </div>
        <div class="content-item">
          <label>签名授权函：</label>
          <div class="item-content">
            <el-image
              style="width: 100px; height: 100px;vertical-align: top;"
              :src="data.powerAttorneyFile||'/img/img.svg'"
            ></el-image>
            <div @click="chooseFile" class="z-btn normal">选择文件</div>
            <br />
            <span>
              ·&nbsp;·签名授权函格式详见
              <font class="z-btn text">
                <a href="/file/附件5：签名授权函（纸质盖章）.doc" download="签名授权函模板.doc">签名授权函模板</a>
              </font>，请按照要求填写、盖章后拍照
              上传
              <input
                type="file"
                ref="file"
                v-show="false"
                @change="fileChange"
              />
            </span>
            <br />
            <span>·&nbsp;上传文件要求jpg格式，且大小不能超过2MB</span>
          </div>
        </div>
        <div class="content-item">
          <label>签名内容来源：</label>
          <div class="item-content">
            <el-radio-group v-model="data.signatureSource">
              <el-radio label="0">企事业单位的全称或者简称</el-radio>
              <br />
              <el-radio label="1">工信部备案网站的全称或简称</el-radio>
              <br />
              <el-radio label="2">APP应用的全称或者简称</el-radio>
              <br />
              <el-radio label="3">公众号或小程序的全称或简称</el-radio>
              <br />
              <el-radio label="4">电商平台店铺名的全称或简称</el-radio>
              <br />
              <el-radio label="5">商标名的全称或简称</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="content-item" v-if="data.signatureSource==1">
          <label>备案网址：</label>
          <div class="item-content">
            <el-input v-model="data.websiteDomainName" placeholder="请输入工信部备案网址" size="small"></el-input>
          </div>
        </div>
        <div class="content-item">
          <label>预估月发送量：</label>
          <div class="item-content">
            <el-radio-group v-model="data.smsVolume">
              <el-radio label="SMALL">1万以下</el-radio>
              <br />
              <el-radio label="MEDIUM">1万——10万</el-radio>
              <br />
              <el-radio label="LARGE">10万——100万</el-radio>
              <br />
              <el-radio label="HUGE">100万以上</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="content-item">
          <label>短信内容：</label>
          <div class="item-content">
            <el-input type="textarea" placeholder="请输入您要发送的短信内容以便审核" v-model="data.smsContent"></el-input>
          </div>
        </div>
        <div class="content-item">
          <label>申请说明：</label>
          <div class="item-content">
            <el-input type="textarea" placeholder="请输入签名申请用途" v-model="data.reason"></el-input>
          </div>
        </div>
        <div class="content-item">
          <label></label>
          <div class="item-content">
            <div @click="check()" class="z-btn">确&nbsp;定</div>
          </div>
        </div>
      </el-col>
      <el-col :span="12" class="right">
        <div class="phone">
          <img src="@/assets/img/phone.svg" alt />
          <div class="text" v-if="data.signature">【{{data.signature}}】</div>
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
      licenseList: [],
      industryList: [],
      imgsrc: ""
    };
  },
  watch: {
    //监听短信类型，如果短信类型为4 那么出现行业类型
    "data.smsType"(val) {
      if (val == "4") {
        this.getIndustry();
      } else {
        this.data.industryId = null;
      }
    },
    'data.signatureSource'(val){
      if(val==1){

      }else{
        this.data.websiteDomainName=null
      }
    }
  },
  props: {
    func: {
      type: Function
    },
    data: {}
  },
  created() {
    //获取短信类型
    this.$store.dispatch("getSmsType").then(res => {
      this.SmsTypeList = res;
    });
    //获取营业执照列表
    this.$store.dispatch("getLicense").then(res => {
      this.licenseList = res;
    });
    this.getIndustry();
  },
  methods: {
    //获取行业
    getIndustry() {
      let url = `/industry/all`;
      this.$http.post(url).then(res => {
        if (res.code == "000000") {
          this.industryList = res.data;
        }
      });
    },
    addlincense(){

      this.$parent.pageIndex=!this.$parent.pageIndex
      this.$parent.tabIndex='2'
    },
    // 文件相关
    chooseFile() {
      this.$refs.file.click();
    },
    //文件改变
    fileChange(e) {
      e = e || window.event;
      let file = e.target.files[0];
      if (file) {
        if (file.type != "image/jpeg") {
          alert("只支持jpg格式");
        }
        if (file.size > 1024 * 1024) {
          alert("图片大小 大于2MB！");
        }
        this.data.file = file;
        this.data.powerAttorneyFile = this.getObjectURL(file);
        console.log(this.data.powerAttorneyFile);
        this.$forceUpdate();
      }
    },
    //获取地址
    getObjectURL(file) {
      var url = this.src;
      if (window.createObjectURL != undefined) {
        // basic
        url = window.createObjectURL(file);
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    },
    //保存或者修改之前
    check() {
      //必填
      let tip = {
        signature: "签名内容",
        smsType: "短信类型",
        businessLicenseId: "营业执照",
        reason: "申请说明",
        smsContent: "短信内容",
        signatureSource: "签名内容来源",
        enterpriseName: "公司名",
        smsVolume: "预估月发生量",
        powerAttorneyFile: "签名授权函"
      };
      if (this.data.smsType == "4") {
        tip.industryId = "行业类型";
      }
      if (this.data.signatureSource == 1) {
        tip.websiteDomainName = "备案网址";
      }
      for (let key in tip) {
        if (!this.data[key]) {
          this.errorTip(tip[key] + "不能为空！");
          return;
        }
      }
      this.save()
    },
    save() {
      let formData = new FormData();
      //1新建2修改
      if (this.data.type == 1) {
        
        formData.append("signature", this.data.signature);
        formData.append("smsType", this.data.smsType);
        this.data.industryId? formData.append("industryId", this.data.industryId) : null;
        formData.append("businessLicenseId", this.data.businessLicenseId);
        formData.append("reason", this.data.reason);
        formData.append("powerAttorneyFile", this.data.file);
        formData.append("smsVolume", this.data.smsVolume);
        this.data.websiteDomainName? formData.append("websiteDomainName", this.data.websiteDomainName): null;
        formData.append("signatureSource", this.data.signatureSource);
        formData.append("smsContent", this.data.smsContent);
        formData.append("enterpriseName", this.data.enterpriseName);
        let url = `/signature/add`;
        this.$http.post(url, formData).then(res => {
          if(res.code=='000000'){
            this.successTip('添加成功')
            this.$parent.pageIndex=!this.$parent.pageIndex
            this.$parent.getdata(1)
          }else{
            this.errorTip(res.message)
          }
        });
      } else {
        let url = `/signature/update`
        formData.append("id", this.data.id);
        formData.append("signature", this.data.signature);
        formData.append("smsType", this.data.smsType);
        this.data.industryId? formData.append("industryId", this.data.industryId) : null;
        formData.append("businessLicenseId", this.data.businessLicenseId);
        formData.append("reason", this.data.reason);
        this.data.file?formData.append("powerAttorneyFile", this.data.file):null;
        formData.append("smsVolume", this.data.smsVolume);
        this.data.websiteDomainName? formData.append("websiteDomainName", this.data.websiteDomainName): null;
        formData.append("signatureSource", this.data.signatureSource);
        formData.append("smsContent", this.data.smsContent);
        formData.append("enterpriseName", this.data.enterpriseName);
        this.$http.post(url,formData)
        .then(res=>{
          console.log(res);
          
        })
      }
    }
  }
};
</script>
<style lang="less" scoped>
@labelW: 120px;
.card {
  margin-top: 24px;
  padding-bottom: 24px;
  margin-bottom: 24px;
  .right {
    padding-top: 24px;
    display: flex;
    justify-content: center;

    .phone {
      height: 496px;
      width: 240px;
      position: relative;
      .text {
        position: absolute;
        width: 154px;
        height: 22px;
        left: 47px;
        top: 84px;
        font-size: 14px;
        line-height: 22px;
        color: #1e2b37;
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
</style>