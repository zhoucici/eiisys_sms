<template>
  <z-page title="秘钥管理">
    <el-row class="card">
      <div class="content">
        <div class="page-search">
          <div class="search-item">
            <div @click="addOpen()" class="z-btn">创建 APP Key</div>
          </div>
        </div>

        <el-table :header-cell-style="elTableClass" :data="dataList" style="width: 100%">
          <el-table-column prop="appKey" label="App Key" min-width="120"></el-table-column>
          <el-table-column prop="appSecret" label="App Secret" min-width="120"></el-table-column>
          <el-table-column prop="groupName" label="分组名称" min-width="50"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="120"></el-table-column>
          <el-table-column min-width="50" label="操作">
            <template slot-scope="scope">
              <div @click="resetApp(scope.row,1)" class="z-btn text">重置</div>
              <div @click="resetApp(scope.row,2)" class="z-btn text">删除</div>
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

    <!-- 编辑和删除 -->
    <!-- 添加 -->
    <el-dialog
      class="pop"
      title="提示信息"
      :visible.sync="delFlag"
      width="600px"
      :before-close="()=>delFlag=false"
    >
      <div class="tip">
        <div class="tip">
          <img src="@/assets/img/error.svg" alt />
          <span>{{title}}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <div class="z-btn" @click="reset()">确 定</div>
        <div class="z-btn normal" @click="()=>delFlag=false">取 消</div>
      </span>
    </el-dialog>

    <!-- 添加 -->
    <el-dialog
      class="pop"
      title="添加 App Kye"
      :visible.sync="addFlag"
      width="600px"
      :before-close="()=>addFlag=false"
    >
      <div class="tip">
        <label>所属用户组：</label>
        <el-select style="width:350px" size="small" v-model="newgroupId" placeholder="请选择">
          <el-option
            v-for="(item, index) in userGrounp"
            :key="index"
            :value="item.groupId"
            :label="item.groupName"
          ></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <div class="z-btn" @click="trueAdd()">确 定</div>
        <div class="z-btn normal" @click="()=>addFlag=false">取 消</div>
      </span>
    </el-dialog>
  </z-page>
</template>
<script>
import table from "@/assets/mixin/eltable.js";
export default {
  mixins: [table],
  data() {
    return {
      nowPage: 1,
      total: 0,
      dataList: [], //数据容器
      addFlag: false, //创建窗口
      delFlag: false, //删除和重置
      nowdata: "",
      userGrounp: [], //用户分组信息
      newgroupId: "",
      title: "是否重置该App Key"
    };
  },
  created() {
    //获取用户列表
    this.$store.dispatch("getUserGroup").then(res => {
      this.userGrounp = res;
    });
    this.getdata(1);
  },
  methods: {
    //页面切换
    handleCurrentChange(val) {
      this.nowPage = val;
      this.getdata();
    },
    //获取数据接口
    getdata(num) {
      num ? (this.nowPage = num) : null;
      let url = `/app/page`;
      this.$http
        .post(url, {
          pageNum: num || this.nowPage
        })
        .then(res => {
          this.dataList = res.data.list;
          this.dataList.map(val => {
            val.createTime = this.gettime(val.createTime);
          });
          this.total = res.data.total;
        });
    },
    //打开添加秘钥窗口
    addOpen() {
      this.addFlag = true;
    },
    //重置和删除秘钥
    reset() {
      if (this.type == 1) {
        let url = `/app/reset`;
        this.$http
          .post(url, {
            id: this.nowdata.id
          })
          .then(res => {
            if (res.code == "000000") {
              this.successTip("重置成功！");
              this.getdata();
              this.delFlag = false;
            } else {
              this.errorTip(res.message);
            }
          });
      } else {
        let url = `/app/delete`;
        this.$http
          .post(url, {
            id: this.nowdata.id
          })
          .then(res => {
            if (res.code == "000000") {
              this.successTip("删除成功！");
              this.getdata(1);
              this.delFlag = false;
            } else {
              this.errorTip(res.message);
            }
          });
      }
    },
    //打开重置窗口方法 1 重置  2删除
    resetApp(data, val) {
      this.nowdata = data;
      val == 1
        ? (this.title = "是否重置该App Key")
        : (this.title = "是否删除该App Key");
      this.type = val;
      this.delFlag = true;
    },
    //添加appkey方法
    trueAdd() {
      if (!this.newgroupId) {
        this.errorTip("请选择所属用户组");
        return;
      }
      let url = `/app/create`;
      this.$http
        .post(url, {
          groupId: this.newgroupId
        })
        .then(res => {
          if (res.code == "000000") {
            this.successTip("添加成功");
            this.getdata(1);
            this.addFlag = false;
            this.newgroupId = null;
          } else {
            this.errorTip(res.message);
          }
        });
    },
    //处理时间
    gettime(val) {
      return val.substr(0, 10) + " " + val.substr(11, 8);
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
        margin-top: 16px;
        margin-bottom: 16px;
      }
      margin-top: 0px;
      margin-bottom: 24px;
    }
  }
}
</style>