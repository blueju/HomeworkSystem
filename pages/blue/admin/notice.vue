<template>
<el-row>
  <el-col :span="24">

    <el-card>
      <div slot="header">通知管理</div>
      <el-form :model="noticeForm" :rules="noticeFormValidate" ref="noticeForm">
        <el-form-item prop="noticeContent">
          <el-input ref="noticeInput" type="textarea" v-model="noticeForm.noticeContent" :autosize="{ minRows: 3, maxRows: 10}" placeholder="请输入通知内容"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="publishNotice">发布通知</el-button>
          <el-button @click="resetNoticeForm('noticeForm')">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 作业表格 -->
      <el-table :data="noticeData" border style="width: 100%" size="small" :default-sort="{prop:'updateTime',order:'descending'}">
        <el-table-column type="index" label="编号"></el-table-column>
        <el-table-column prop="content" label="通知内容"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="150px" sortable></el-table-column>
        <el-table-column label="操作" width="80px;">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="deleteNotice(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

  </el-col>
</el-row>
</template>

<script>
import axios from "axios";
export default {
  layout: "system",
  created() {
    this.getNotice();
  },
  mounted() {
    this.$refs["noticeInput"].focus();
  },
  data() {
    return {
      noticeData: [],
      noticeForm: {
        noticeContent: ""
      },
      noticeFormValidate: {
        noticeContent: [{
          required: true,
          message: "请输入通知内容",
          trigger: "blur"
        }]
      }
    };
  },
  methods: {
    resetNoticeForm(formName) {
      this.$refs[formName].resetFields();
      this.$refs["noticeInput"].focus();
    },
    // 获取通知
    getNotice() {
      axios({
        method: "get",
        url: "/api/notice"
      }).then(response => {
        if (response.data.success) {
          let mapResult = response.data.result.map(item => {
            return {
              _id: item._id,
              content: item.content,
              updateTime: item.update_time
            };
          });
          this.noticeData = mapResult;
        }
      });
    },
    // 发布通知
    publishNotice() {
      this.$refs['noticeForm'].validate((valid) => {
        if (valid) {
          axios({
            method: "post",
            url: "/api/notice",
            data: {
              content: this.noticeForm.noticeContent
            }
          }).then(res => {
            if ((res.status === 200) & (res.data.success === true)) {
              this.$message.success("通知发布成功");
              this.$refs['noticeForm'].resetFields();
              this.$refs["noticeInput"].focus();
              this.getNotice();
              this.dialogFormVisible = false;
            } else {
              this.$message.error("通知发布失败");
            }
          });
        }
      })
    },
    // 删除通知
    deleteNotice(index, row) {
      this.$confirm("此操作将永久删除该通知, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
        .then(() => {
          axios({
              method: "delete",
              url: "/api/notice",
              params: {
                _id: row._id
              }
            })
            .then(res => {
              if ((res.status === 200) & (res.data.success === true)) {
                this.$message.success("通知删除成功");
                this.getNotice();
                this.dialogFormVisible = false;
              } else {
                this.$message.error("通知删除失败");
              }
            })
            .catch(err => {
              this.$message.error("网络出错，通知删除失败");
            });
        })
        .catch(err => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>
