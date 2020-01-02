<template>
  <!-- 添加营业执照 -->
  <el-dialog
    title="签名详情"
    :visible.sync="show_flag"
    width="600px"
    height="458px"
    :before-close="clearPop"
  >
    <div class="content">
      <div class="item">
        <label>公司：</label>
        <div class="item-content">{{data.enterpriseName}}</div>
      </div>
      <div class="item">
        <label>签名内容：</label>
        <div class="item-content">{{data.signature}}</div>
      </div>
      <div class="item">
        <label>签名类型：</label>
        <div class="item-content">{{data.smsType|smsType}}</div>
      </div>
      <div v-if="data.smsType==4" class="item">
        <label>行业类型：</label>
        <div class="item-content">{{industryId}}</div>
      </div>
      <div class="item">
        <label>短信内容：</label>
        <div class="item-content">{{data.smsContent}}</div>
      </div>
      <div class="item">
        <label>创建时间：</label>
        <div class="item-content">{{data.createTime}}</div>
      </div>
      <div class="item">
        <label>审核状态：</label>

        <div class="item-content">
          <span
            class="status"
            :class="{green:data.examine==1,red:data.examine==2,yellow:data.examine==0}"
          ></span>
          &nbsp;{{data.examine|status}}
        </div>
      </div>
      <div class="item">
        <label>审核说明：</label>
        <div class="item-content">{{data.reason}}</div>
      </div>
      <div class="item">
        <label>失败原因：</label>
        <div class="item-content">{{data.reviewDesc||'--'}}</div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <div class="z-btn normal" @click="clearPop">取 消</div>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      industryList:[]
    };
  },
  model: {
    prop: "show_flag",
    event: "change"
  },
  props: {
    show_flag: {
      default: false,
      type: Boolean
    },
    data: {}
  },
  computed: {
    industryId(val){
      let value='--'
      this.industryList.map(val=>{
        (this.data.industryId==val.id)&&(value=val.name)
      })
      return value
    },
  },
  filters: {
    status(val) {
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
    },
    smsType(val){
      switch (val) {
        case 1:
          return "通知类短信";
          break;
        case 2:
          return "营销类短信";
          break;
        case 3:
          return "验证码短信";
        case 4:
          return "行业短信";
          break;
      }
    }
  },
  watch: {
    data(val) {
      this.getIndustry() 
      
    }
  },
  methods: {
    clearPop() {
      this.$emit("change", false);
    },
    //获取行业
    getIndustry(func) {
      let url = `/industry/all`;
      this.$http.post(url).then(res => {
        if (res.code == "000000") {
          console.log(res);
          
          this.industryList = res.data;
        }
      });
    },
  }
};
</script>
<style lang="less" scoped>
.content {
  font-family: PingFangSC;
  color: #1e2b37;
  padding: 2px 20px 0 20px;
  .item {
    line-height: 22px;
    font-size: 14px;
    label {
      width: 80px;
      display: inline-block;
      text-align: right;
      vertical-align: top;
    }
    .item-content{
      display: inline-block;
      width: calc(~'100% - 80px')
    }
    & + .item {
      margin-top: 12px;
    }
  }
}
</style>