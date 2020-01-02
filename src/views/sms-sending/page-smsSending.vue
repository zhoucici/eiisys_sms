<template>
  <z-page v-if="pageIndex==1" title="短信发送">
    <el-row class="card">
      <z-tabTop
        :barLen="100"
        width="140px"
        v-model="index"
        :titleArr="[
                    {
                        name:'发送平台',
                        index:'1',
                    },
                    {
                        name:'发送任务记录',
                        index:'2',
                    }
                    
                ]"
      ></z-tabTop>

      <div class="send-from" v-if="index=='1'">
        <div class="left">
          <div class="item">
            <label>任务名称：</label>
            <el-input
              size="small"
              v-model="sendName"
              placeholder="请输入任务名称，不超过30个全角或半角字符"
              maxlength="30"
              show-word-limit
            ></el-input>
          </div>
          <div class="item">
            <label>短信类型：</label>
            <el-select
              :popper-append-to-body='false'
              size="small"
              @change="SmsTypechange"
              v-model="nowSmsType.id"
              placeholder="请选择短信类型"
            >
              <el-option
                v-for="(item, index) in SmsTypeList"
                :key="index"
                :value="item.type"
                :label="item.name"
              ></el-option>
            </el-select>
          </div>

          <div v-if="nowSmsType.id=='4'" class="item">
            <label>行业类型：</label>
            <el-select
              size="small"
              v-model="nowIndustry.id"
              @change="chooseIndustry"
              :popper-append-to-body="false"
              placeholder="请选行业类型"
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

          <div class="item">
            <label>短信签名：</label>
            <el-select
            :popper-append-to-body='false'
              size="small"
              @change="chooseSignature"
              v-model="nowSignatureID"
              placeholder="请选择短信签名"
            >
              <el-option
                v-for="(item, index) in signatureList"
                :key="index"
                :value="item.signature"
                :label="item.signature"
              ></el-option>
            </el-select>
            <div class="tip">
              ·&nbsp;没有需要的签名？
              <div
                @click="()=>{this.$router.push({name:'signature-manage'})}"
                class="z-btn text"
              >添加签名</div>
            </div>
          </div>
          <div class="item">
            <label>短信模板：</label>
            <el-select
              size="small"
              @change="chooseTemplate"
              v-model="nowtemplateCode"
              :popper-append-to-body='false'
              placeholder="请选择短信模板"
            >
              <el-option
                v-for="(item, index) in templateList"
                :key="index"
                :value="item.templateCode"
                :label="item.templateName"
              ></el-option>
            </el-select>
            <div class="tip">
              ·&nbsp;没有需要的模版？
              <div @click="()=>{this.$router.push({name:'temp-manage'})}" class="z-btn text">添加模板</div>
            </div>
          </div>
          <div class="item textarea">
            <label>短信内容：</label>
            <div class="SmsContent">
              <span v-if="this.nowSignature.signature">【{{this.nowSignature.signature}}】</span>
              <span v-for="(item, index) in nowTemplate.contentList" :key="index">
                {{item}}
                <input
                  class="code"
                  :placeholder="'${'+nowTemplate.codeList[index]+'}'"
                  v-model="codeList[index]"
                  oninput="if(value.length>4)value=value.slice(0,30)"
                  v-if="nowTemplate.codeList[index]"
                  :disabled="receiveType=='1'"
                  :class="{disabled:receiveType=='1'}"
                  type="text"
                />
              </span>
            </div>
            <div class="tip">·&nbsp;短信字数：{{getLength}}&nbsp;拆分条数：{{getNum}}</div>
          </div>
          <div class="item">
            <label>接收号码：</label>

            <el-radio-group @change="changeType" v-model="receiveType">
              <el-radio label="1">导入接收号码文件</el-radio>
              <el-radio label="2">手动输入号码</el-radio>
            </el-radio-group>

            <div v-if="receiveType=='1'" class="upload">
              <div class="file" v-if="file">
                <img src="@/assets/img/file.svg" alt />
                <span :title="this.file.name" class="filename">{{this.file.name}}</span>
                <span @click="delFile()" class="z-btn text" style="float:right">删除</span>
              </div>
              <div @click="chooseFile()" class="z-btn normal">导入号码</div>
            </div>
            <div v-if="receiveType=='2'" class="upload">
              <!-- 手动输入号码 -->
              <div
                class="manual"
                :class="{error:manualerror,active:focus}"
                @click="()=>{this.$refs.manual.focus()}"
              >
                <el-tag
                  size="mini"
                  disable-transitions
                  style="float:left;margin:5px;"
                  v-for="(item, index) in manuallist"
                  @close="handleClose(item)"
                  :type="item.type"
                  :key="index"
                  closable
                >{{item.phone}}</el-tag>
                <input
                  @keyup="toNum"
                  @keyup.enter="HandleManual"
                  @focus="()=>focus=true"
                  @blur="manualblur"
                  v-model="manualtext"
                  maxlength="15"
                  :disabled="manualerror"
                  ref="manual"
                  :placeholder="manuallist.length>0?'':'请输入手机号码'"
                />
              </div>
              <div v-if="manualerror" class="error">请输入正确的手机号码</div>
            </div>
            <div v-if="receiveType=='1'" class="tip">
              <div>
                ·&nbsp;请上传xlsx格式文件，
                <el-popover placement="top" width="300" trigger="hover">
                  <div class="code-font">
                    变量模版范例："您好尊敬的
                    <font>${name}</font>,您的验证码是
                    <font>${code}</font>,5分钟内有效"
                  </div>
                  <div class="z-btn text" slot="reference">变量模版</div>
                </el-popover>接收号码文件
                <div class="z-btn text">
                  <a href="/file/接收号码.xlsx" download="接收号码.xlsx">范例下载</a>
                </div>
                <br />
              </div>
              <span>·&nbsp;请保持导入文件的变量顺序与模版内容的变量顺序一致，请严格遵守范例样式</span>
              <br />
              <span>·&nbsp;文件大小不可超过3M，建议单次导入号码2万个以内</span>
            </div>

            <div v-if="receiveType=='2'" class="tip">
              <span>·&nbsp;输入手机号敲击回车键确定，光标定在输入框内可继续输入</span>
              <br />
              <span>·&nbsp;手动输入号码时且选择的是带变量模板时，请手动输入变量值</span>
              <br />
              <span>·&nbsp;大批量号码建议通过文件导入</span>
            </div>
          </div>

          <div class="item">
            <div @click="check()" style="margin-left:80px;" class="z-btn">发 送</div>
          </div>
        </div>
        <div class="right">
          <div class="phone">
            <img src="/img/phone.svg" alt />
            <div class="view">
              <div class="text" v-if="this.nowSignature.signature">
                <span style="z-index:100;">
                  【{{this.nowSignature.signature}}】
                  <span
                    v-for="(item, index) in nowTemplate.contentList"
                    :key="index"
                  >
                    {{item}}
                    <span
                      v-if="nowTemplate.codeList[index]"
                    >{{codeList[index]||'${'+nowTemplate.codeList[index]+'}'}}</span>
                  </span>
                </span>
                <div class="smsTip">
                  <span>短信字数：{{getLength}}</span>
                  <br />
                  <span>计费条数：{{getNum}}</span>
                  <br />
                  <!-- <div class="z-btn text">查看短信计费规则</div> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="send-record" v-if="index=='2'">
        <el-table :header-cell-style="elTableClass" :data="dataList" style="width: 100%">
          <el-table-column prop="taskName" label="任务名称" min-width="120"></el-table-column>
          <el-table-column prop="sendTime" label="发送时间" min-width="70"></el-table-column>
          <el-table-column prop="phoneAmount" align="right" label="号码数量" min-width="50"></el-table-column>
          <el-table-column prop="failAmount" align="right" label="失败短信数量" min-width="50"></el-table-column>
          <el-table-column prop="status" align="center" label="任务状态" min-width="80">
            <template slot-scope="scope">
              <span
                class="status"
                :class="{green:scope.row.status==1,red:scope.row.status==2,yellow:scope.row.status==0}"
              ></span>
              &nbsp;{{scope.row.status|status}}
            </template>
          </el-table-column>
          <el-table-column min-width="50" label="操作">
            <template slot-scope="scope">
              <div @click="showSms(scope.row)" style="margin:0" class="z-btn text">查看详情</div>
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

    <!-- 添加 -->
    <el-dialog
      top="30vh"
      class="pop"
      title="提示信息"
      :visible.sync="addFlag"
      width="600px"
      :before-close="()=>addFlag=false"
    >
      <div class="tip">
        <img src="@/assets/img/error.svg" alt />
        <span>确定发送短信吗</span>
        <div class="sendtip" v-if="this.receiveType=='1'">
          检索短信成功数：{{filedata.success}} 条；
          <br />
          检索短信错误数：{{filedata.error}} 条；
          <br />
          检索短信重复数：{{filedata.repetition}} 条；
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <div class="z-btn" @click="save()">确 定</div>
        <div class="z-btn normal" @click="()=>addFlag=false">取 消</div>
      </span>
    </el-dialog>
    <!-- 文件选择器 -->
    <input type="file" id="file" accept=".xlsx" ref="file" v-show="false" @change="fileChange" />
  </z-page>

  <task-details v-else :func="func" :data="nowdata"></task-details>
</template>
<script>
import table from "@/assets/mixin/eltable.js";
import taskDetails from "./task-details.vue";
export default {
  components: {
    taskDetails
  },
  mixins: [table],
  data() {
    return {
      focus: false,
      filedata: "",
      pageIndex: 1,
      manualtext: "",
      manuallist: [],
      manualerror: false,
      receiveType: "1", //接收号码形式  1 导入接收号码文件  2手动输入号码（不支持变量模板）
      index: "1",
      addFlag: false,
      file: "",
      sendName: "", //发送名称
      codeList: [],
      SmsTypeList: [],
      nowSmsType: {},
      nowtemplateCode: "",
      industryList: [],
      nowIndustry: {},
      signatureList: [],
      nowSignature: {},
      nowSignatureID: "",
      templateList: [],
      nowTemplate: {},
      nowdata: {},
      smsContent: "",

      dataList: [],
      nowPage: 1,
      total: 0,
      paramsId: "",
      paramsCode: "",
      saveBtn_flag: true
    };
  },
  watch: {
    manualtext(val) {
      this.$refs.manual.style.maxWidth = "400px";
      this.$refs.manual.style.minWidth = "1px";
      this.$refs.manual.style.width = val.length * 8 + "px";
    },
    index(val) {
      if (val == "2") {
        this.getdata();
      }
    },
    //监听短信类型，如果短信类型为4 那么出现行业类型
    "nowSmsType.id"(val) {
      this.nowTemplate = {};
      this.nowSignature = {};
      this.nowIndustry = {};
      if (val == "4") {
        this.getIndustry();
      } else {
        this.getSignature();
        this.getTemplate();
      }
    },
    nowSignatureID(val) {
      if (this.nowIndustry.id) {
        console.log(123);
        
        val && this.getTemplate(true);
      }
    },
    "nowIndustry.id"(val) {
      this.getSignature(true);
    }
  },
  filters: {
    status(val) {
      switch (val) {
        case 1:
          return "发送完成";
          break;
        case 2:
          return "发送失败";
          break;
        case 0:
          return "发送中";
          break;
      }
    }
  },
  computed: {
    getLength() {
      let length = 0;
      if (this.nowTemplate.contentList) {
        this.nowTemplate.contentList.map((val, i) => {
          length += val.length;
          length += this.codeList[i] ? this.codeList[i].length : 0;
        });
      }
      this.nowSignature.signature
        ? (length += 2 + this.nowSignature.signature.length)
        : null;

      return length;
    },

    getNum() {
      this.getLength < 70;
      if (this.getLength <= 70) {
        return 1;
      } else {
        return Math.ceil(this.getLength / 67);
      }
    }
  },
  created() {
    //获取短信类型
    this.$store.dispatch("getSmsType").then(res => {
      this.SmsTypeList = res;
    });
  },
  mounted() {
    this.paramsId = this.$route.params.smsType;
    this.paramsCode = this.$route.params.templateCode;
    this.paramsId &&
      (this.$set(this.nowSmsType, "id", this.paramsId) || (this.paramsId = ""));
  },
  methods: {
    toNum(val) {
        this.manualtext = this.manualtext.replace(/[^\d]/g, "")
      
      
      this.$forceUpdate()
    },
    chooseIndustry() {
      this.nowSignatureID = "";
    },
    SmsTypechange() {
      this.nowIndustry = "";
      this.nowtemplateCode = "";
      this.nowSignatureID = "";
    },
    //
    manualblur() {
      this.HandleManual();
      this.focus = false;
    },
    //关闭tag
    handleClose(val) {
      this.manuallist.splice(this.manuallist.indexOf(val), 1);
      if (val.type == "danger") {
        this.manualerror = false;
      }
      this.$refs.manual.focus();
      this.$refs.manual.placeholder =
        this.manuallist.length == 0 ? "请输入手机号码" : "";
      this.manuallist.length == 0
        ? (this.$refs.manual.style.width = "170px")
        : null;
    },
    //将手动输入的数字变成tag
    HandleManual(val) {
      if (this.manualtext == "" || this.manualtext == undefined) {
        return;
      }
      let error;
      // 如果相同
      this.manuallist.map(val => {
        if (val.phone == this.manualtext) {
          error = true;
        }
      });
      if (error) {
        this.manualtext = "";
        return;
      }
      if (/^1[3456789]\d{9}$/.test(this.manualtext)) {
        this.manuallist.push({
          phone: this.manualtext,
          type: "success"
        });
        this.manualerror = false;
      } else {
        this.manuallist.push({
          phone: this.manualtext,
          type: "danger"
        });
        this.manualerror = true;
      }
      this.manualtext = "";

      this.$refs.manual.placeholder =
        this.manuallist.length == 0 ? "请输入手机号码" : "";
    },
    // 跳转到任务详情
    showSms(val) {
      this.nowdata = val;
      this.pageIndex = 2;
    },
    //要传进添加任务详情里面的方法
    func() {
      this.pageIndex = 1;
      this.index = "2";
    },
    //发送  先上 传文件，得到文件ID后 调用发送接口
    async save() {
      if (this.saveBtn_flag) {
        this.saveBtn_flag = false;
        if (this.receiveType == "1") {
          this.nowdata.fileName = this.filedata.file;
          //真正发送的方法
          let url = `/send/task/add`;

          await this.$http.post(url, this.nowdata).then(res => {
            if (res.code == "000000") {
              this.successTip("发送成功，请到发送记录查看进度");
              this.addFlag = false;
              this.nowSmsType = {};
              this.sendName = "";
              this.nowIndustry = "";
              this.nowtemplateCode = "";
              this.nowSignatureID = "";
              this.file = "";
              document.getElementById("file").value = "";
            } else {
              this.errorTip(res.message);
            }
            // this.saveBtn_flag=true
          });
        } else {
          let obj = {};
          this.nowTemplate.codeList.map((val, i) => {
            obj[val] = this.codeList[i];
          });
          this.nowdata.parameters = JSON.stringify(obj);
          //真正发送的方法
          let url = `/send/task/add`;
          this.$http.post(url, this.nowdata).then(res => {
            if (res.code == "000000") {
              this.successTip("发送成功，请到发送记录查看进度");
              this.addFlag = false;
              this.nowSmsType = {};
              this.sendName = "";
              this.nowIndustry = "";
              this.nowtemplateCode = "";
              this.nowSignatureID = "";
              this.file = "";
              this.phonesTo = "";
            } else {
              this.errorTip(res.message);
            }
            // this.saveBtn_flag=true
          });
        }
      } else {
        return;
      }
    },
    getdata() {
      let url = `/send/task/page`;
      this.$http
        .post(url, {
          pageNum: this.nowPage
        })
        .then(res => {
          this.dataList = res.data.list;
          this.dataList.map(val => {
            val.sendTime = this.gettime(val.sendTime);
          });
          this.total = res.data.total;
        });
    },
    //检查
    check() {
      //必填
      this.nowdata = {
        smsType: this.nowSmsType.id,
        taskName: this.sendName,
        signature: this.nowSignature.signature,
        templateCode: this.nowTemplate.templateCode
      };
      let tip = {
        taskName: "任务名称",
        smsType: "短信类型",
        signature: "短信签名",
        templateCode: "短信模板"
      };
      if (this.nowdata.smsType == "4") {
        this.nowdata.industryId = this.nowIndustry.id;
        tip.industryId = "行业类型";
      }
      if (this.receiveType == "1") {
        this.nowdata.fileName = this.file;
        tip.fileName = "接收号码文件";
        this.nowdata.sendType = 2;
      } else {
        let phone = "";
        let error;
        this.manuallist.map((val, i) => {
          console.log(val);

          error = val.type == "danger";
          phone += i == 0 ? val.phone : "," + val.phone;
        });
        if (error) {
          this.errorTip("请输入正确的手机号码！");
          return;
        }
        this.nowdata.phonesTo = phone;
        this.nowdata.sendType = 1;
        tip.phonesTo = "发送手机号码";
        console.log(this.nowdata.phonesTo);
      }

      for (let key in tip) {
        if (
          (!this.nowdata[key] && this.nowdata[key] != 0) ||
          this.nowdata[key] === ""
        ) {
          this.errorTip(tip[key] + "不能为空！");
          return;
        }
      }
      let flag = false;
      if (this.receiveType == "2") {
        this.nowTemplate.contentList.map((val, i) => {
          if (
            this.nowTemplate.codeList[i] &&
            (this.codeList[i] == "" || !this.codeList[i])
          ) {
            this.errorTip("请输入短信内容中的变量！");
            flag = true;
          }
        });
        flag ? (this.addFlag = false) : (this.addFlag = true);
      } else {
        let url = `/send/task/parameter/upload`;
        let formData = new FormData();
        formData.append("file", this.nowdata.fileName);
        formData.append("templateCode", this.nowdata.templateCode);
        this.$http.post(url, formData).then(res => {
          if (res.code == "000000") {
            this.filedata = res.data;
            this.addFlag = true;
          } else {
            this.errorTip(res.message);
          }
        });
      }
    },
    changeType() {
      this.codeList.map((val, i) => {
        this.codeList[i] = "";
      });
      this.$forceUpdate();
    },
    chooseSignature() {
      this.signatureList.map(val => {
        if (this.nowSignatureID == val.signature) {
          this.nowSignature = val;
        }
      });
    },
    //页面切换
    handleCurrentChange(val) {
      this.nowPage = val;
      this.getdata();
    },
    chooseTemplate() {
      this.templateList.map(val => {
        if (this.nowtemplateCode == val.templateCode) {
          console.log(val);

          this.nowTemplate = val;
        }
      });
      this.codeList.map((val, i) => {
        this.codeList[i] = "";
      });
    },
    delFile() {
      this.file = "";
      document.getElementById("file").value = "";
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
        if (file.size > 3 * 1024 * 1024) {
          this.errorTip("文件大小 大于3MB！");
          document.getElementById("file").value = "";
          return;
        }
        this.file = file;
      }
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
    //获取模板
    getTemplate(hasIndustry = false) {
      let url = `/template/list`;
      this.$http
        .post(url, {
          industryId: hasIndustry ? this.nowIndustry.id || null : null,
          smsType: this.nowSmsType.id
        })
        .then(res => {
          if (res.code == "000000") {
            this.templateList = res.data;
            if (this.paramsCode) {
              this.$set(this, "nowtemplateCode", this.paramsCode);
              this.chooseTemplate();
              this.paramsCode = "";
            } else {
              this.$set(this, "nowtemplateCode", "") || this.chooseTemplate();
            }
          }
        });
    },
    //处理时间
    gettime(val) {
      if (val) {
        return val.substr(0, 10) + " " + val.substr(11, 8);
      } else {
        return "--";
      }
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
  margin-top: 24px;
  position: relative;
  .right {
    display: inline-block;

    top: 80px;
    position: absolute;
    .phone {
      .view {
        position: absolute;
        top: 60px;
        left: 16px;
        height: 373px;
        width: 208px;
        overflow: auto;
        > .text {
          position: absolute;
          width: 170px;
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
          .smsTip {
            padding-right: 10px;
            width: 100%;
            position: absolute;
            bottom: -70px;
            text-align: right;
            font-size: 12px;
            line-height: 20px;
            color: #99a4ad;
            .text {
              font-size: 12px;
              line-height: 20px;
            }
          }
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
  }
  .left {
    display: inline-block;
    width: 770px;
    padding-left: 64px;

    .item {
      margin-top: 20px;
      label {
        font-size: 14px;
      }
      &:first-child {
        margin-top: 24px;
      }
      & + .textarea {
        label {
          vertical-align: top;
        }
        .SmsContent {
          display: inline-block;
          background: #fff;
          border: 1px solid #c2cdd6;
          box-sizing: border-box;
          border-radius: 4px;
          width: 424px;
          height: 120px;
          padding: 5px 12px;
          font-size: 14px;
          line-height: 22px;
          color: #1e2b37;
          overflow: auto;
          .disabled {
            cursor: not-allowed;
            background: none;
          }
          .code {
            max-width: 80px;
            border: none;
            outline: none;
          }
          input::-webkit-input-placeholder {
            color: #99a4ad;
          }

          input:-moz-placeholder {
            color: #99a4ad;
          }

          input::-moz-placeholder {
            color: #99a4ad;
          }

          input::-ms-input-placeholder {
            color: #99a4ad;
          }
        }
      }
      /deep/.el-input {
        display: inline-block !important;
        width: 424px;
      }
      /deep/.el-scrollbar {
        width: 424px;
      }
      .upload {
        .manual {
          cursor: pointer;
          display: inline-block;
          width: 424px;
          min-height: 32px;
          border-radius: 4px;
          border: 1px solid #dfe3e8;
          padding: 0px 12px;
          position: relative;
          transition: 0.3s;
          &.active {
            border: #5c6ac4 1px solid;
          }
          & + .error {
            transition: 0.3s;
            color: #e55130 !important;
            font-size: 12px;
          }
          &.error {
            border: 1px solid #e55130;
          }
          > input {
            float: left;
            margin: 5px;
            font-size: 14px;
            line-height: 22px;
            border: none;
            &:focus {
              outline: none;
            }
            &:disabled {
              cursor: default;
              background-color: #fff;
            }
          }
        }
        .file {
          width: 320px;
          height: 32px;
          display: inline-block;
          vertical-align: middle;
          background: #f0f2f5;
          border-radius: 4px;
          margin-right: 15px;

          img {
            margin: 9px 10px;
          }
          span {
            line-height: 32px;
            vertical-align: top;
          }
          .filename {
            display: inline-block;
            height: 100%;
            width: calc(~"100% - 97px");
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .z-btn {
          vertical-align: middle;
        }
        margin-left: 80px;
        padding: 20px 0 0px 0;
      }
      .tip {
        margin-left: 80px;
        font-size: 14px;
        margin-top: 12px;
        span {
          line-height: 20px;
          color: #99a4ad;
        }
        color: #99a4ad;
      }
    }
  }
}
.send-from,
.send-record {
  padding-bottom: 24px;
}
.code-font {
  padding: 5px;
  line-height: 32px;
  font {
    color: rgb(101, 202, 226);
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
.send-record {
  padding: 12px 24px;
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
.sendtip {
  font-weight: 500;
  position: absolute;
  font-size: 14px;
  line-height: 22px;
  top: 135px;
  color: rgba(0, 0, 0, 0.85);
  left: 120px;
}
/deep/.el-scrollbar__view .el-select-dropdown__list {
  width: 50%;
  overflow: hidden;
}
/deep/ .el-select-dropdown {
  width: 100%;
}
</style>