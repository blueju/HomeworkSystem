<template>
<el-row>
  <el-col :span="8" offset="8">
    <el-card :body-style="{ padding: '0px' }" style="margin-top:10px">
      <div slot="header">
        <span>个人中心</span>
      </div>
      <!-- card body -->
      <el-form :model="form" ref="form" label-width="80px" label-position="top" style="padding:20px">
        <el-form-item label="学号">
          <el-input v-model="this.$store.state.userName" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="this.$store.state.userId" disabled></el-input>
        </el-form-item>
        <el-form-item label="班级">
          <el-input v-model="this.$store.state.userClass" disabled></el-input>
        </el-form-item>
        <el-form-item label="身份">
          <el-input v-model="type" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="this.$store.state.email" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="this.$store.state.phone" disabled></el-input>
        </el-form-item>
      </el-form>
    </el-card>
  </el-col>
</el-row>
</template>

<script>
export default {
  name: "my-info",
  layout: "system",
  created() {},
  computed: {
    type() {
      if (this.$store.state.type === 'admin') {
        return '管理员'
      } else {
        return '学生'
      }
    }
  },
  data() {
    return {};
  }
};
</script>
