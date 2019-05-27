<template>
<section class="login">
  <Row>
    <Col :xs="{span:22,offset:1}" :sm="{span:16,offset:4}" :md="{span:14,offset:5}" :lg="{span:8,offset:8}">
    <Row>

      <!-- 找回密码 -->
      <Card :bordered="false" class="login-form-card">
        <p slot="title">找回密码</p>
        <Form ref="findPasswordForm" :model="findPasswordForm" :rules="findPasswordFormValidate">
          <FormItem label="学号" prop="studentId">
            <Input placeholder="请输入你的学号" v-model="findPasswordForm.studentId" ref="studentIdInput" clearable></Input>
          </FormItem>
          <FormItem label="手机号码" prop="phoneNumber">
            <Input placeholder="请输入你绑定的手机号码" v-model="findPasswordForm.phoneNumber" clearable></Input>
            <Alert :type="status" style="margin-top:10px">{{tip}}</Alert>
            <Alert type="warning">旧密码将作废，请使用 <strong>短信验证码</strong> 进行登录操作</Alert>
          </FormItem>
          <FormItem>
            <Button @click="toLogin">
              <Icon type="md-arrow-back" />
              返回
              </Button>
            <Button ref="sendMessageCodeButton" type="primary" @click="sendMessageCode" disabled>{{buttonText}}</Button>
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
export default {
  layout: "default",
  data() {
    // 验证手机号是否存在
    let validatePhoneNumber = (rule, value, callback) => {
      axios({
        method: 'get',
        url: '/api/validate-phone-number',
        params: {
          studentId: this.findPasswordForm.studentId,
          phoneNumber: this.findPasswordForm.phoneNumber
        }
      }).then((res) => {
        // console.log(res);
        switch (res.data.success) {
          case true:
            this.status = 'success'
            this.tip = '学号-手机号对应正确'
            this.$refs['sendMessageCodeButton'].$el.removeAttribute('disabled')
            // callback();
            break
          case false:
            this.status = 'error'
            this.tip = '该学号对绑定的手机号码不存在'
            this.$refs['sendMessageCodeButton'].$el.setAttribute('disabled', 'true')
            break
        }
        callback();
      })
    }
    return {
      sendphoneNumberCodeInterval: null,
      buttonText: '点击发送 “短信验证码”',
      tip: '等待发送 “短信验证码”',
      status: 'info',
      findPasswordForm: {
        studentId: "152511012",
        phoneNumber: ""
      },
      findPasswordFormValidate: {
        studentId: [{
            required: true,
            message: "请输入学号",
            trigger: "change"
          },
          {
            validator: validatePhoneNumber,
            trigger: "change",
          }
        ],
        phoneNumber: [{
            required: true,
            message: "请输入你绑定的手机号码",
            trigger: "blur"
          },
          {
            validator: validatePhoneNumber,
            trigger: "change",
          }
        ]
      }
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs['studentIdInput'].focus()
    })
  },
  methods: {
    // 返回
    toLogin() {
      this.$router.push('/login')
    },
    // 发送短信验证码
    sendMessageCode() {
      this.$refs['findPasswordForm'].validate(valid => {
        this.$refs['sendMessageCodeButton'].$el.setAttribute('disabled', 'true')
        if (valid) {
          axios({
            method: 'post',
            url: '/api/send-message-code',
            data: {
              studentId: this.findPasswordForm.studentId,
              phoneNumber: this.findPasswordForm.phoneNumber
            }
          }).then((res) => {
            if (res.status === 200 && res.data.success === true) {
              this.tip = res.data.message
              let second = 60
              if (!this.sendphoneNumberCodeInterval) {
                this.sendphoneNumberCodeInterval = setInterval(() => {
                  if (second == 1) {
                    this.buttonText = `点击发送 “短信验证码”`
                    clearInterval(this.sendphoneNumberCodeInterval)
                  } else {
                    second--
                    this.buttonText = `已发送 ${second}s`
                  }
                }, 1000);
                setTimeout(() => {
                  this.$refs['sendMessageCodeButton'].$el.removeAttribute('disabled')
                }, 1000 * 60);
              } else {
                console.log('已有定时器');
              }
            } else {
              this.tip = res.data.message
              this.status = 'error'
              this.$refs['sendMessageCodeButton'].$el.removeAttribute('disabled')
            }
          })
        } else {
          this.$message.warning('请填写正确后再提交')
        }
      })
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
