<template>
<div class="layout">
  <Layout>
    <!-- header -->
    <my-header></my-header>

    <Layout style="flex-direction:row;">
      <!-- 菜单 -->
      <Sider class="sider">
        <Menu active-name="" theme="light" width="auto" :open-names="['1']" class="sider-menu">
          <!-- 学生 -->
          <MenuGroup title="学生用户" v-if="this.$store.state.type=='student'">
            <MenuItem name="1-1" to="/blue/student/recently-homework">
            <Icon type="md-document" />最近作业
            </MenuItem>
            <MenuItem name="1-2" to="/blue/student/history-homework">
            <Icon type="ios-list" />历史作业
            </MenuItem>
          </MenuGroup>
          <!-- 管理员 -->
          <MenuGroup title="管理员用户" v-if="this.$store.state.type=='admin'">
            <MenuItem name="2-1" to="/blue/admin/publish">
            <Icon type="md-document" />作业管理
            </MenuItem>
            <MenuItem name="2-2" to="/blue/admin/notice">
            <Icon type="md-chatbubbles" />通知管理
            </MenuItem>
            <MenuItem name="2-3" to="/blue/admin/download">
            <Icon type="md-chatbubbles" />下载作业
            </MenuItem>
          </MenuGroup>

          <MenuGroup title="系统设置">
            <MenuItem name="3-1" to="/blue/my-info">
            <Icon type="md-settings" />个人中心
            </MenuItem>
            <MenuItem name="3-2" to="/blue/alter-password">
            <Icon type="md-key" />修改密码
            </MenuItem>
          </MenuGroup>

          <MenuGroup title="关于系统">
            <MenuItem name="4-1" to="/blue/about">
            <Icon type="ios-school" />系统介绍
            </MenuItem>
            <MenuItem name="4-2" to="/exit">
            <Icon type="md-snow" />注销
            </MenuItem>
          </MenuGroup>

        </Menu>
        <footer style="text-align:center;margin-top:5px;">
          <p style="color:#eee;font-size:12px;">Copyright © 1998 - {{thisYear}} <br> LanJu All Rights Reserved.</p>
        </footer>
      </Sider>
      <!-- 内容 -->
      <Content class="content">
        <nuxt />

      </Content>
    </Layout>

  </Layout>
  </Layout>
</div>
</template>

<script>
import axios from "axios";
import {
  mapState
} from "vuex";

import MyHeader from "./../components/public/header";
import MyFooter from "./../components/public/footer";

export default {
  data() {
    return {
      thisYear: "",
      userInfo: null,
      flag: 0
    };
  },
  computed: {
    ...mapState({
      type: state => state.type
    })
  },
  components: {
    MyHeader,
    MyFooter
  },
  methods: {
    async checkLogin() {
      console.log('xxx');
      console.log(this.$router);
      console.log(this.$route);
      console.log(this.$routes);
      let currentPage = this.$route.path.split('/')[this.$route.path.split('/').length - 1]
      let result = await axios({
        method: "get",
        url: "/api/checkLogin"
      });
      if (result.status === 200 && result.data.success) {
        this.falg = 1
        result = result.data.data
        let userInfo = {
          userId: result.userId,
          userName: result.userName,
          type: result.type,
          userClass: result.userClass,
          email: result.email,
          phone: result.phone
        }
        this.$store.dispatch("setUserInfo", userInfo); //存入vuex
        let adminRouter = ['notice', 'publish', 'download', 'detail-data']
        if (userInfo.type === 'student' && adminRouter.includes(currentPage)) {
          this.$router.push('/403')
        }
      } else if (result.data.success && this.falg === 1) {
        this.$alert('您长时间未操作，登录已超时，请重新登录', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.$router.push('/login')
          }
        });

      } else if (result.data.success) {
        console.log('未登录');
        this.$router.push('/login')
      } else {
        console.log("checkLogin请求失败");
        console.group(result);
        this.$router.push('/login')
      }
    }
  },
  created() {
    this.checkLogin();
    this.thisYear = new Date().getFullYear();
  }
}
</script>

<style lang="scss" scoped>
$header: 64px;

.content {
  height: calc(100vh - 64px);
}
</style>
