<template>
  <!-- 添加营业执照 -->
  <el-dialog
    title="发送详情"
    :visible.sync="show_flag"
    width="600px"
    height="458px"
    :before-close="clearPop"
  >
    <div class="content">
      <div class="item">
        <label>手机号码：</label>
        <div class="item-content">{{data.phoneTo}}</div>
      </div>
      <div class="item">
        <label>短信内容：</label>
        <div class="item-content">{{data.smsContent}}</div>
      </div>
      <div class="item">
        <label>短信类型：</label>
        <div class="item-content">{{data.smsType}}</div>
      </div>
      <div class="item">
        <label>字数：</label>
        <div class="item-content">{{data.smsContent?data.smsContent.length:'--'}}</div>
      </div>
      <div class="item">
        <label>计费条数：</label>
        <div class="item-content">{{data.len}}</div>
      </div>
      <div class="item">
        <label>发送时间：</label>
        <div class="item-content">{{data.sendTime}}</div>
      </div>
      <div class="item">
        <label>发送状态：</label>

        <div class="item-content">
          <span
            class="status"
            :class="{green:data.status==1,red:data.status==2,yellow:data.status==0}"
          ></span>
          &nbsp;{{data.status|status}}
        </div>
      </div>
      <div class="item">
        <label>接收状态：</label>

        <div class="item-content">{{data.receiveMessage}}</div>
      </div>
      <div class="item">
        <label>错误说明：</label>
        <div class="item-content">{{data.receiveDescription}}</div>
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
    return {};
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
    }
  },
  watch: {
    data(val) {
      val.smsType = this.$parent.$parent.getSmsType(val.smsType);
    }
  },
  methods: {
    clearPop() {
      this.$emit("change", false);
    }
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
      width: 85px;
      display: inline-block;
      text-align: right;
      vertical-align: top;
    }
    .item-content{
      display: inline-block;
      width: calc(~'100% - 85px')
    }
    & + .item {
      margin-top: 12px;
    }
  }
}
</style>