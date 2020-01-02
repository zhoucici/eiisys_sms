<template>
  <el-dialog
    top="20vh"
    title="充值"
    :visible.sync="flag"
    width="600px"
    :before-close="close"
  >
    <div class="recharge-main">
      <div class="kuaifu-balance">
        快服账户余额：
        <span>￥{{(kuaifuBlance.kfBalance/1000).toFixed(2)}}</span>
        <font
          @click="$func.openLinkTo($url.kuaifu+'?controller=myrecharge&token=',1)"
          class="z-btn text"
        >立即充值</font>
      </div>
      <div class="sms-balance">
        短信账户余额：
        <span>￥{{(kuaifuBlance.smsBalance/1000).toFixed(2)}}</span>
      </div>
      <div class="recharge-num">
        充值金额：
        <el-input type="text" v-model="rechargeNum" size="small" style="width:180px">
          <div class="recharge-tip" slot="prefix">￥</div>
        </el-input>
        <div class="tip">·&nbsp;请输入大于 10 的整数，充值款项将从快服账户余额中扣除</div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <div class="z-btn" @click="recharge()">确 定</div>
      <div class="z-btn normal" @click="close">取 消</div>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      rechargeNum:10
    };
  },
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    kuaifuBlance: {}
  },
  methods: {
      close(){
          this.$emit('close',false)
      },
    //充值方法
    recharge() {
      let reg = /^((1[0-9])|([2-9]\d)|([1-9]\d{2,}))$/;
      if (!reg.test(this.rechargeNum)) {
        this.errorTip("请输入正确的数值！");
        return;
      }
      this.$emit('close',false)
      let url = `/user/recharge`;
      this.$http.post(url, this.rechargeNum).then(res => {
        if (res.code == "000000") {
          this.$store.dispatch("getUserInfo", true)
          this.successTip("充值成功");
        } else {
          this.errorTip(res.message);
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
    .recharge-main {
  padding: 0 20px;
  font-size: 14px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.85);
  span {
    color: #5c6ac4;
  }
  .kuaifu-balance {
    padding-bottom: 20px;
    border-bottom: 1px solid #e9e9e9;
    .z-btn {
      margin-left: 16px;
    }
  }
  .sms-balance {
    padding: 20px 0 16px 0;
  }
  .recharge-num {
    .recharge-tip {
      line-height: 31px;
      color: rgba(0, 0, 0, 0.85);
      margin-left: 5px;
    }
    .tip {
      margin-top: 12px;
      margin-left: 74px;
      color: #99a4ad;
      margin-bottom: 12px;
    }
  }
}
</style>