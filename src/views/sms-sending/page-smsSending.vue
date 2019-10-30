<template>
  <z-page title="短信发送">
    <el-row class="card">
      <el-tabs v-model="index">
        <el-tab-pane class="send-from" label="用户管理" name="1">
          <div class="left">
            <div class="item">
              <label>任务名称：</label>
              <el-input size="small" placeholder="请输入名称，不超过30个字符" maxlength="30" show-word-limit></el-input>
            </div>
            <div class="item">
              <label>短信类型：</label>
              <el-select size="small" v-model="nowSmsType.id" placeholder="请选择">
                <el-option
                  v-for="(item, index) in SmsTypeList"
                  :key="index"
                  :value="item.id"
                  :label="item.name"
                ></el-option>
              </el-select>
            </div>

            <div v-if="nowSmsType.id=='4'" class="item">
              <label>行业类型：</label>
              <el-select size="small" v-model="nowIndustry.id" placeholder="请选择">
                <el-option
                  v-for="(item, index) in industryList"
                  :key="index"
                  :value="item.id"
                  :label="item.name"
                ></el-option>
              </el-select>
            </div>

            <div class="item">
              <label>短信签名：</label>
              <el-select size="small" v-model="nowSignature.id" placeholder="请选择">
                <el-option
                  v-for="(item, index) in signatureList"
                  :key="index"
                  :value="item.industryId"
                  :label="item.signature"
                ></el-option>
              </el-select>
              <div class="tip">
                ·&nbsp;没有需要的签名？
                <div class="z-btn text">添加签名</div>
              </div>
            </div>
            <div class="item">
              <label>短信模板：</label>
              <el-select size="small" v-model="nowTemplate.id" placeholder="请选择">
                <el-option
                  v-for="(item, index) in templateList"
                  :key="index"
                  :value="item.id"
                  :label="item.name"
                ></el-option>
              </el-select>
              <div class="tip">
                ·&nbsp;没有需要的模版？
                <div class="z-btn text">添加模板</div>
              </div>
            </div>
            <div class="item textarea">
              <label>短信内容：</label>
              <el-input type="textarea" disabled  v-model="smsContent"></el-input>
              <div class="tip">
                ·&nbsp;短信字数：{{smsContent.lenght}}&nbsp;短信字数：{{smsContent.lenght}}
                
              </div>
            </div>
          </div>
          <div class="right"></div>
        </el-tab-pane>
        <el-tab-pane class="send-record" label="配置管理" name="2">配置管理</el-tab-pane>
      </el-tabs>
    </el-row>
  </z-page>
</template>
<script>
export default {
  data() {
    return {
      index: "1",
      SmsTypeList: [],
      nowSmsType: {},

      industryList: [],
      nowIndustry: {},

      signatureList: [],
      nowSignature: {},

      templateList: [],
      nowTemplate: {},

      smsContent: ""
    };
  },
  watch: {
    //监听短信类型，如果短信类型为4 那么出现行业类型
    "nowSmsType.id"(val) {
      if (val == "4") {
        this.getIndustry(this.getTemplate);
      } else {
        this.getSignature();
        this.getTemplate();
      }
    },
    "nowIndustry.id"(val) {
      this.getSignature(true);
    }
  },
  created() {
    //获取短信类型
    this.$store.dispatch("getSmsType").then(res => {
      this.SmsTypeList = res;
    });
  },
  methods: {
    //获取行业
    getIndustry(func) {
      let url = `/industry/all`;
      this.$http.post(url).then(res => {
        console.log(res);
        if (res.code == "000000") {
          this.industryList = res.data;
        }
        if (func) {
          func();
        }
      });
    },
    //获取模板
    getTemplate(hasIndustry = false) {
      let url = `/template/list`;
      this.$http
        .post(url, {
          industryId: hasIndustry ? this.nowIndustry.id || null : null,
          smsType: this.nowSmsType.id
        })
        .then(res => {
          console.log(res);
          if (res.code == "000000") {
            this.templateList = res.data;
          }
        });
    },
    //获取签名
    getSignature(hasIndustry = false) {
      let url = `/signature/list`;
      this.$http
        .post(url, {
          industryId: hasIndustry ? this.nowIndustry.id || null : null,
          smsType: this.nowSmsType.id
        })
        .then(res => {
          if (res.code == "000000") {
            this.signatureList = res.data;
          }
        });
    }
  }
};
</script>
<style lang="less" scoped>
.card {
  width: 1118px;
  margin-top: 24px;
  .right {
    width: 40%;
  }
  .left {
    width: 60%;
    padding-left: 64px;

    .item {
      margin-top: 20px;
      &:first-child {
        margin-top: 24px;
      }
      &+.textarea{
        label{
          vertical-align: top;
        }
        /deep/textarea{
          height: 120px;
        }
      }
      /deep/.el-input,.el-textarea {
        display: inline-block!important;
        width: 424px;
      }
      /deep/.el-scrollbar {
        width: 424px;
      }
      .tip {
        margin-left: 80px;
        margin-top: 16px;
        font-size: 14px;
        line-height: 14px;
        color: #99a4ad;
      }
      
    }
  }
}
.send-from,
.send-record {
  height: 610px;
}
</style>