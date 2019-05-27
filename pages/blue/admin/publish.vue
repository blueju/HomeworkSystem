<template>
<el-row>
  <el-col :span="24">

    <el-card class="box-card">
      <!-- 发布作业 -->
      <el-button type="success" icon="el-icon-plus" circle @click="openPublishForm"></el-button>
      <br><br>

      <!-- 作业表格 -->
      <el-table :data="homeworkData" border style="width: 100%" size="small" :default-sort="{prop: 'deadline', order: 'descending'}">
        <el-table-column type="index" label="编号"></el-table-column>
        <el-table-column prop="subject" label="科目名称" sortable></el-table-column>
        <el-table-column prop="homeworkName" label="作业名称" sortable></el-table-column>
        <el-table-column prop="teacher" label="任课老师" sortable></el-table-column>
        <el-table-column label="是否将其设为历史作业">
          <template slot-scope="scope">
            <el-button size="mini" v-if="scope.row.isHistory==='true'" type="success" icon="el-icon-check" circle></el-button>
            <el-button size="mini" v-else type="danger" icon="el-icon-close" circle></el-button>
            <el-button size="mini" type="warning" @click="toggleStatus(scope.row)">切换状态</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="deadline" label="截止时间" sortable></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" v-if="scope.row.isHistory==='true'" @click="editHomework(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" v-else disabled="">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteHomework(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 查看/编辑作业 弹窗 -->
    <el-dialog title="作业详情" :visible.sync="dialogFormVisible" width="38%" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form :model="homeworkData_item" label-position="left" size="medium" label-width="80px">
        <el-form-item label="科目名称" prop="subject">
          <el-input v-model="homeworkData_item.subject"></el-input>
        </el-form-item>
        <el-form-item label="作业名称" prop="homeworkName">
          <el-input v-model="homeworkData_item.homeworkName"></el-input>
        </el-form-item>
        <el-form-item label="任课老师" prop="teacher">
          <el-input v-model="homeworkData_item.teacher"></el-input>
        </el-form-item>
        <el-form-item label="截止时间" prop="deadline">
          <el-date-picker v-model="homeworkData_item.deadline" type="datetime" placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="作业后缀" prop="suffix">
          <el-input v-model="homeworkData_item.suffix" placeholder="填写作业命名后缀"></el-input>
        </el-form-item>
        <el-form-item label="模板地址" prop="template_path">
          <el-input v-model="homeworkData_item.template_path" placeholder="填写模板地址"></el-input>
        </el-form-item>
        <el-alert style="margin-top:0;margin-bottom:22px;padding:5px" type="warning" :closable="false">
          为节省服务器带宽资源，推荐上传至 <b>微云</b>、<b>百度云</b> 后，将分享链接粘贴至此。
        </el-alert>
        <el-form-item label="作业要求" prop="remark">
          <el-input v-model="homeworkData_item.remark" type="textarea" :autosize="{ minRows: 5, maxRows: 10}"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAlter">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 发布新作业 弹窗 -->
    <el-dialog title="发布新作业" :visible.sync="publishNewHomeworkVisible" width="38%" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form :model="publishNewHomeworkForm" ref="publishNewHomeworkForm" :rules="publishNewHomeworkFormValidate" label-position="left" size="medium" label-width="80px">
        <el-form-item label="科目名称" prop="subject">
          <el-input v-model="publishNewHomeworkForm.subject" placeholder="填写科目名称" ref="subjectInput"></el-input>
        </el-form-item>
        <el-form-item label="作业名称" prop="homeworkName">
          <el-input v-model="publishNewHomeworkForm.homeworkName" placeholder="填写作业名称"></el-input>
        </el-form-item>
        <el-form-item label="任课老师" prop="teacher">
          <el-input v-model="publishNewHomeworkForm.teacher" placeholder="填写任课老师"></el-input>
        </el-form-item>
        <el-form-item label="截止时间" prop="deadline">
          <el-date-picker v-model="publishNewHomeworkForm.deadline" type="datetime" placeholder="选择截止时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="作业后缀" prop="suffix">
          <el-input v-model="publishNewHomeworkForm.suffix" placeholder="填写作业命名后缀"></el-input>
        </el-form-item>
        <el-form-item label="相关资料" prop="templatePath">
          <el-input v-model="publishNewHomeworkForm.templatePath" placeholder="填写相关资料所在链接"></el-input>
        </el-form-item>
        <el-alert style="margin-top:0;margin-bottom:22px;padding:5px" type="warning" :closable="false">
          为节省服务器带宽资源，推荐上传至 <b>微云</b>、<b>百度云</b> 后，将分享链接粘贴至此。
        </el-alert>
        <el-form-item label="作业要求" prop="remark">
          <el-input v-model="publishNewHomeworkForm.remark" type="textarea" placeholder="填写作业要求" :autosize="{ minRows: 5, maxRows: 10}"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetPublishForm">清空退出</el-button>
        <el-button type="primary" @click="confirmPublish">确认发布</el-button>
      </div>
    </el-dialog>

  </el-col>
</el-row>
</template>

<script>
import axios from 'axios'

export default {
  layout: "system",
  created() {
    this.getHomeworkData()
  },
  data() {
    return {
      // 控制 作业详情弹窗 的显示隐藏状态
      dialogFormVisible: false,
      // 控制 发布新作业弹窗 的显示隐藏状态
      publishNewHomeworkVisible: false,
      // 发布新作业 表单
      publishNewHomeworkForm: {
        subject: "",
        homeworkName: "",
        deadline: "",
        remark: "",
        teacher: "",
        template_path: "",
        suffix: "",
      },
      publishNewHomeworkFormValidate: {
        subject: [{
          required: true,
          message: '请输入科目名称',
          trigger: 'blur'
        }],
        homeworkName: [{
          required: true,
          message: '请输入作业名称',
          trigger: 'blur'
        }],
        deadline: [{
          required: true,
          message: '请选择截止日期',
          trigger: 'blur'
        }],
        remark: [{
          required: true,
          message: '请输入作业要求',
          trigger: 'blur'
        }],
        teacher: [{
          required: true,
          message: '请输入任课老师',
          trigger: 'blur'
        }],
        templatePath: [{
          required: true,
          message: '请输入资料下载地址，若无，请填写“无”',
          trigger: 'blur'
        }],
        suffix: [{
          required: true,
          message: '请输入作业命名后缀',
          trigger: 'blur'
        }],
      },
      // 暂存查看每项作业时，每项作业的数据（没有的话会报错）
      homeworkData_item: {
        _id: "",
        subject: "",
        homeworkName: "",
        deadline: "",
        remark: "",
        teacher: "",
        template_path: "",
        prefix: "",
        suffix: "",
        show: "",
        update_time: ""
      },
      // 作业详情弹窗中需要显示的数据
      homeworkData: []
    };
  },
  methods: {
    openPublishForm() {
      this.publishNewHomeworkVisible = true
      setTimeout(() => {
        this.$refs['subjectInput'].focus()
      }, 0)
    },
    // 清空退出发布作业表单
    resetPublishForm() {
      this.$refs['publishNewHomeworkForm'].resetFields()
      this.publishNewHomeworkVisible = false
    },
    // 加载作业信息
    getHomeworkData() {
      axios({
        method: 'get',
        url: '/api/all-homework'
      }).then((res) => {
        if (res.status === 200 && res.data.success) {
          let mapResult = (res.data.result).map(item => {
            return {
              _id: item._id,
              subject: item.subject,
              homeworkName: item.homework_name,
              deadline: item.deadline,
              remark: item.remark,
              teacher: item.teacher,
              template_path: item.template_path,
              prefix: item.prefix,
              suffix: item.suffix,
              isHistory: item.show,
              update_time: item.update_time,
            }
          })
          this.homeworkData = mapResult;
        } else {
          // this.$message.error('加载作业信息失败，请刷新重试')
        }
      }).catch(err => {
        console.log('网络出现错误');
      })
    },

    //时间戳转yyyy-mm-dd
    getdate(time) {
      console.log(time);
      // console.log((new Date()).getTime(time));

      let y = time.getFullYear()
      let m = time.getMonth() + 1
      let d = time.getDate()
      return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + time.toTimeString().substr(0, 8);
    },

    //确认发布 作业信息
    confirmPublish() {
      this.$refs['publishNewHomeworkForm'].validate((valid) => {
        if (valid) {
          this.publishNewHomeworkForm.deadline = this.getdate(this.publishNewHomeworkForm.deadline)
          axios({
            method: "post",
            url: '/api/publish-homework',
            data: this.publishNewHomeworkForm
          }).then((res) => {
            if (res.status === 200 & res.data.success === true) {
              this.$message.success('作业发布成功')
              this.getHomeworkData()
              // 清空
              for (let i in this.publishNewHomeworkForm) {
                this.publishNewHomeworkForm[i] = ""
              }
              this.publishNewHomeworkVisible = false
            } else {
              this.$message.error('作业发布失败')
            }
          }).catch(err => {
            this.$message.error('网络出错，作业发布失败');
          })
        } else {
          this.$message.error('请填写正确后再提交')
        }
      })
    },

    //确认修改 作业信息
    confirmAlter() {
      this.homeworkData_item.deadline = this.getdate(this.homeworkData_item.deadline)
      axios({
        method: "post",
        url: '/api/alter-homework',
        data: this.homeworkData_item
      }).then((res) => {
        if (res.status === 200 & res.data.success === true) {
          this.$message.success('作业修改成功')
          this.getHomeworkData()
          this.dialogFormVisible = false
        } else {
          this.$message.error('作业修改失败')
        }
      }).catch(err => {
        this.$message.error('网络出错，作业发布失败');
      })
    },

    // 打开作业详情弹窗
    editHomework(index, row) {
      this.dialogFormVisible = true;
      this.homeworkData_item = row;
      // console.log(index, row);
    },

    //删除该作业
    deleteHomework(index, row) {
      // console.log(index, row);
      this.$confirm('此操作将永久删除该作业, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        axios({
          method: "post",
          url: '/api/delete-homework',
          data: {
            _id: row._id
          }
        }).then((res) => {
          if (res.status === 200 & res.data.success === true) {
            this.$message.success('作业删除成功')
            this.getHomeworkData()
            this.dialogFormVisible = false
          } else {
            this.$message.error('作业删除失败')
          }
        }).catch(err => {
          this.$message.error('网络出错，作业删除失败');
        })
      }).catch((err) => {
        // console.log(err);
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    // 切换状态
    toggleStatus(row) {
      let status = row.isHistory === 'true' ? false : true;
      axios({
        method: 'post',
        url: '/api/toggle-status',
        data: {
          _id: row._id,
          status: status
        }
      }).then((res) => {
        if (res.status === 200 && res.data.success === true) {
          this.$message.success('修改状态成功')
          this.getHomeworkData()
        } else {
          this.$message.error('修改状态失败')
        }
      }).catch(err => {
        console.log('网络开小差了，切换状态失败');
      })
    }
  }
};
</script>

<style lang="scss">
el-row {
  margin: 10px;
}

.diy-ele-dialog {
  .el-dialog__body {
    // padding-top: 10px;
  }
}
</style>
