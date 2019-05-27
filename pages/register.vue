<template>
<section class="login">
  <Row>
    <Col :xs="{span:22,offset:1}" :sm="{span:16,offset:4}" :md="{span:14,offset:5}" :lg="{span:8,offset:8}">
    <Row>
      <!-- 注册表单 -->
      <Card :bordered="false" class="login-form-card">
        <p slot="title">注册</p>
        <Form ref="RegisterForm" label-position="top" :model="RegisterForm" :rules="RegisterFormValidate">
          <FormItem label="学号" prop="StudentId">
            <Input
                v-model="RegisterForm.StudentId"
                placeholder="请输入学号"
                ref="studentIdInput"
              ></Input>
          </FormItem>
          <FormItem label="姓名" prop="StudentName">
            <Input
                v-model="RegisterForm.StudentName"
                placeholder="请输入姓名"
              ></Input>
          </FormItem>
          <FormItem label="邮箱" prop="Email">
            <Input
                v-model="RegisterForm.Email"
                placeholder="请输入邮箱"
              ></Input>
          </FormItem>
          <FormItem label="手机号码" prop="Phone">
            <Input
                v-model="RegisterForm.Phone"
                placeholder="请输入手机号码"
              ></Input>
          </FormItem>
          <FormItem label="验证码" prop="pictureCode">
            <img src="/api/get-captcha" class="pictureCode">
            <Input
                v-model="RegisterForm.pictureCode"
                placeholder="请输入验证码"
                type="text"
              ></Input>
          </FormItem>
          <FormItem label="密码" prop="Password">
            <Input
                v-model="RegisterForm.Password"
                placeholder="请输入密码"
                type="password"
              ></Input>
          </FormItem>
          <FormItem label="确认密码" prop="ConfirmPassword">
            <Input
                v-model="RegisterForm.ConfirmPassword"
                placeholder="请输入密码"
                type="password"
                v-on:keyup.enter.native="Submit('RegisterForm')"
              ></Input>
          </FormItem>
          <FormItem>
            <Button
                type="primary"
                @click="Submit('RegisterForm')"
              >注册</Button>
            <Button
                @click="Reset('RegisterForm')"
                style="margin-left: 8px"
              >清空</Button>
            <Button
                type="dashed"
                @click="toLogin"
                style="margin-left: 8px"
              >已有账号？去登录</Button>
          </FormItem>
        </Form>
      </Card>
    </Row>
    </Col>
  </Row>
</section>
</template>

<script>
import axios from 'axios'
import cryptoJs from 'crypto-js'
export default {
  layout: "none",
  data() {
    /**
     * 表单校验自定义规则
     */
    const ValidateConfirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入确认密码'));
      } else if (value !== this.RegisterForm.Password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    const ValidatePictureCode = (rule, value, callback) => {
      let captcha = document.cookie.split(';')[0].split('=')[1]
      console.log(document.cookie);
      console.log(document.cookie.split(';')[0].split('=')[1]);
      console.log(captcha);
      
      if (value === '') {
        callback(new Error('请输入验证码'));
      } else if (value != captcha) {
        callback(new Error('验证码错误'));
      } else {
        callback();
      }
    };
    return {
      RegisterForm: {
        StudentId: "152511012",
        StudentName: "",
        Email: "",
        Phone: "",
        Password: "",
        ConfirmPassword: ""
      },
      RegisterFormValidate: {
        StudentId: [{
          required: true,
          message: "请输学号",
          trigger: "blur"
        }],
        StudentName: [{
          required: true,
          message: "请输学号",
          trigger: "blur"
        }],
        Email: [{
          required: true,
          message: "请输入邮箱",
          trigger: "blur"
        }],
        Phone: [{
          required: true,
          message: "请输入手机号码",
          trigger: "blur"
        }],
        pictureCode: [{
            required: true,
            message: "请输入验证码",
            trigger: "blur"
          },
          {
            validator: ValidatePictureCode,
            trigger: "blur",
            required: true
          }
        ],
        Password: [{
          required: true,
          message: "请输入密码",
          trigger: "blur"
        }],
        ConfirmPassword: [{
          required: true,
          message: "请输入确认密码",
          trigger: "blur"
        }, {
          validator: ValidateConfirmPassword,
          trigger: "blur",
          required: true
        }]
      }
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs['studentIdInput'].focus()
    })
  },
  methods: {
    /** 提交表单 */
    Submit() {
      this.$refs['RegisterForm'].validate((valid) => {
        if (valid) {
          axios({
            url: '/api/register',
            method: 'post',
            data: {
              StudentId: this.RegisterForm.StudentId,
              StudentName: this.RegisterForm.StudentName,
              Email: this.RegisterForm.Email,
              Phone: this.RegisterForm.Phone,
              Password: cryptoJs.SHA1(this.RegisterForm.Password).toString()
            }
          }).then((res) => {
            if (res.data.code === 1000) {
              this.$Message.error(res.data.message);
            } else if (res.data.success) {
              this.$Message.success(res.data.message); //注册成功
              this.$router.push('/login');
            } else {
              this.$Message.error(res.data.message); //注册失败
            }
          })
        } else {
          this.$Message.error("请填写正确后再提交");
        }
      })
    },
    /** 重置表单 */
    Reset(name) {
      this.$refs[name].resetFields();
      this.$refs['studentIdInput'].focus();
    },
    /** 去注册 */
    toLogin() {
      this.$router.push('/login')
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

.pictureCode {
  box-sizing: border-box;
  border: 1px solid #dcdee2;
  border-radius: 4px;
  height: 32px;
}
</style>
