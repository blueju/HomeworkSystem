<template>
<section class="login">
  <Row>
    <Col :xs="{span:22,offset:1}" :sm="{span:16,offset:4}" :md="{span:14,offset:5}" :lg="{span:8,offset:8}">
    <Row>
      <!-- 注册表单 -->
      <Card :bordered="false" class="login-form-card">
        <p slot="title">登录</p>
        <Form ref="LoginForm" label-position="top" :model="LoginForm" :rules="LoginFormValidate">
          <FormItem label="学号" prop="StudentId">
            <Input
                v-model="LoginForm.StudentId"
                placeholder="请输入学号"
                ref="studentIdInput"
              ></Input>
          </FormItem>
          <FormItem label="密码" prop="Password">
            <Input
                v-model="LoginForm.Password"
                placeholder="请输入密码"
                v-on:keyup.native.enter="submit"
                type="password"
              ></Input>
          </FormItem>
          <FormItem>
            <Button
                type="primary"
                @click="submit"
              >登录</Button>
            <Button
                @click="reset"
                style="margin-left: 8px"
              >清空</Button>
            <Button
                type="dashed"
                @click="toRegister"
                style="margin-left: 8px"
              >没账号？去注册</Button>
            <Button
                type="dashed"
                @click="toFindPassword"
                style="margin-left: 8px"
              >找回密码</Button>
          </FormItem>
        </Form>
      </Card>
    </Row>
    </Col>
  </Row>
</section>
</template>

<script>
import axios from "axios";
import cryptoJs from "crypto-js";
export default {
  layout: "default",
  head() {
    return {
      title: "作业系统 登录页",
      meta: [{
        hid: "descriptionz",
        name: "作业系统 登录页",
        content: "作业系统 登录页"
      }]
    };
  },
  data() {
    return {
      LoginForm: {
        StudentId: "152511012",
        Password: ""
      },
      LoginFormValidate: {
        StudentId: [{
            required: true,
            message: "请输学号",
            trigger: "blur"
          },
          {
            max: 11,
            message: "学号超出最大长度11位",
            trigger: "blur"
          }
        ],
        Password: [{
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            max: 11,
            message: "密码超出最大长度11位",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.checkLogin();
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs['studentIdInput'].focus()
    })
  },
  methods: {
    toFindPassword() {
      this.$router.push('/find-password')
    },
    /** 提交表单 */
    submit() {
      this.$refs['LoginForm'].validate((valid) => {
        if (valid) {
          axios({
            url: "/api/login",
            method: "post",
            data: {
              StudentId: this.LoginForm.StudentId,
              Password: cryptoJs.SHA1(this.LoginForm.Password).toString()
            }
          }).then(res => {
            if (res.data.code === 1003) {
              //已登录，直接跳转
              this.$router.push("/blue/student/recently-homework");
            } else if (res.data.success) {
              //登录成功
              this.$Message.success("登录成功");
              let userInfo = {
                userId: res.data.data.userId,
                userName: res.data.data.userName,
                type: res.data.data.type,
                userClass: res.data.data.userClass,
                email: res.data.data.email
              };
              this.$store.dispatch("setUserInfo", userInfo); //保存用户ID，姓名和类型到vuex和sessionStorage
              switch (userInfo.type) {
                case "student":
                  this.$router.push("/blue/student/recently-homework");
                  break
                case "admin":
                  this.$router.push("/blue/admin/publish");
                  break
              }
            } else {
              //登录失败
              this.$Message.error("学号或密码错误");
            }
          });
        } else {
          this.$Message.error("请填写正确后再提交");
        }
      })
    },
    /** 重置表单 */
    reset() {
      this.$refs['LoginForm'].resetFields()
      this.$refs['studentIdInput'].focus()
    },
    /** 去注册 */
    toRegister() {
      this.$router.push("/register");
    },
    /** 检查sessionStorage，如果有，则将sessionStorage里的数据加到Vuex，然后跳到系统页 */
    checkLogin() {
      axios({
        method: "get",
        url: "/api/checkLogin"
      }).then(res => {
        let result = res.data;
        if (result.success) {
          let userInfo = {
            userId: res.data.data.userId,
            userName: res.data.data.userName,
            type: res.data.data.type,
            userClass: res.data.data.userClass,
            email: res.data.data.email
          };
          this.$store.dispatch("setUserInfo", userInfo);
          // console.log('用户身份', userInfo, type);
          switch (userInfo.type) {
            case "student":
              this.$router.push("/blue/student/recently-homework");
              break
            case "admin":
              this.$router.push("/blue/admin/publish");
              break
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.login {
  width: 100vw;
  height: 100vh;
  background-color: #eee;

  .login-form-card {
    margin-top: 100px;
  }
}
</style>
