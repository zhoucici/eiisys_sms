<template>
  <!-- 添加营业执照 -->
  <el-dialog
    title="模板详情"
    :visible.sync="show_flag"
    width="600px"
    height="458px"
    :before-close="clearPop"
  >
    <div class="content">
      <div class="item">
        <label>模板名称：</label>
        <div class="item-content">{{data.templateName}}</div>
      </div>
      <div class="item">
        <label>业务编号：</label>
        <div class="item-content">{{data.templateCode}}</div>
      </div>
      <div class="item">
        <label>模板类型：</label>
        <div class="item-content">{{data.smsType}}</div>
      </div>
      <div class="item">
        <label>模板内容：</label>
        <div class="item-content">{{data.templateContent}}</div>
      </div>
      <div class="item">
        <label>所属用户组：</label>
        <div class="item-content">{{data.groupName}}</div>
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
      console.log(this.$parent.$parent);

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