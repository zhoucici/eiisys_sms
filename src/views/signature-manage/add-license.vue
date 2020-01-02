<template>
  <!-- 添加营业执照 -->
  <el-dialog
    :title="title"
    :visible.sync="show_flag"
    width="600px"
    height="337px"
    :before-close="clearPop"
  >
    <div class="item">
      <label>公司名称：</label>
      <el-input size="small" style="width:436px" v-model="data.name " maxlength="100"
              show-word-limit></el-input>
    </div>
    <div class="item">
      <label>营业执照：</label>

      <el-image
        style="width: 100px; height: 100px;vertical-align: top;"
        :src="imgsrc ||'/img/img.svg'"
        :previewSrcList="imgsrc=='/img/img.svg'? []:[imgsrc]"
      ></el-image>

      <div @click="chooseFile" class="z-btn normal">选择文件</div>
      <span>（只支持JPG格式的图片且小于2MB）</span>
    </div>
    <span slot="footer" class="dialog-footer">
      <div class="z-btn" @click="save()">确 定</div>
      <div class="z-btn normal" @click="clearPop">取 消</div>
    </span>
    <!-- 文件选择器 -->
    <input type="file" ref="file" accept=".jpg, .jpeg" v-show="false" @change="fileChange" />
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      imgsrc: "",
      title: ""
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
  watch: {
    data: {
      handler(val) {
        if (this.data.type == 1) {
          this.title = "添加营业执照";
          (!val.businessLicensePic)&&(this.imgsrc = "/img/img.svg");
        } else {
          this.title = "修改营业执照";
          this.imgsrc = val.businessLicensePic;
        }
      },
      deep: true
    }
  },
  methods: {
    clearPop() {
      this.$emit("change", false);
    },

    //文件改变
    fileChange(e) {
      e = e || window.event;
      let file = e.target.files[0];
      if (file) {
        console.log(file);

        if (file.type != "image/jpeg") {
          this.errorTip('只支持jpg格式！')
          return
        }
        if (file.size > 1024 * 1024) {
          this.errorTip("图片大小 大于2MB！")
          return
        }
        this.data.file = file;
        this.imgsrc = this.getObjectURL(file);
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

    save() {
      let formData = new FormData();
      if (this.data.type == 1) {
        formData.append("file", this.data.file);
        formData.append("companyName", this.data.name);
        if (!this.data.name) {
            this.errorTip('请填写公司名称！')
            return
        }
        if(!this.data.file){
          this.errorTip('请上传营业执照！')
            return
        }
        let url = "/business/save";
        this.$http.post(url, formData).then(res => {
          console.log(res);
          if (res.code == "000000") {
            this.successTip(res.message);
            this.$emit("success");
            this.clearPop();
          } else {
            this.errorTip(res.message);
          }
        });
      } else {
        formData.append("id", this.data.id);
        this.data.file&& formData.append("file", this.data.file)
        formData.append("companyName", this.data.name);
        let url = '/business/update'
        this.$http.post(url,formData)
        .then(res=>{
            if(res.code=='000000'){
              this.successTip('修改成功！')
              this.$emit("success")
              this.clearPop()
            }else{
              this.errorTip(res.message)
            }
        })
      }
    },
    // 文件相关
    chooseFile() {
      this.$refs.file.click();
    }
  }
};
</script>
<style lang="less" scoped>
.item {
  & + .item {
    margin-top: 20px;
  }
  /deep/.el-input__inner{
    padding-right: 60px;
  }
}

img {
  vertical-align: top;
  width: 100px;
  height: 100px;
}

.z-btn {
  margin-left: 20px;
  vertical-align: bottom;
}
.z-btn + span {
  vertical-align: bottom;
}
</style>