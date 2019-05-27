<template>
<div id="person-center">
  <Row>
    <Col :xs="{span:22,offset:1}" :sm="{span:16,offset:4}" :md="{span:14,offset:5}" :lg="{span:8,offset:8}">
    <Card>
      <p slot="title">修改密码</p>
      <Form ref="AlterPasswordForm" :model="AlterPasswordForm" :rules="AlterPasswordFormValidate">
        <!-- <FormItem label="学号">
          <Input :placeholder="PersonInfoForm.StudentID" disabled></Input>
        </FormItem>
        <FormItem label="姓名">
          <Input :placeholder="PersonInfoForm.StudentName" disabled></Input>
        </FormItem>
        <FormItem label="班级">
          <Input :placeholder="PersonInfoForm.Class" disabled></Input>
        </FormItem> -->
        <FormItem label="邮箱">
          <Input :placeholder="this.$store.state.email" disabled></Input>
          <Alert type="warning" style="margin-top:5px">邮箱验证码有效期为1分钟</Alert>
          <Button ref="sendEmailCodeButton" type="primary" @click="sendEmailCode">{{buttonText}}</Button>
        </FormItem>
        <FormItem label="验证码" prop="EmailCode">
          <Input ref="codeInput" placeholder="请输入验证码" v-model="AlterPasswordForm.EmailCode"></Input>
        </FormItem>
        <FormItem label="密码" prop="Password">
          <Input ref="passwordInput" placeholder="请输入密码" type="password" v-model="AlterPasswordForm.Password" ></Input>
        </FormItem>
        <FormItem label="确认密码" prop="ConfirmPassword">
          <Input ref="confirmPasswordInput" placeholder="请输入密码" type="password" v-model="AlterPasswordForm.ConfirmPassword" ></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="Submit('AlterPasswordForm')">确认修改</Button>
          <Button style="margin-left:10px" @click="Reset('AlterPasswordForm')">重置</Button>
        </FormItem>
      </Form>
    </Card>
    </Col>
  </Row>
  <br>
</div>
</template>

<script>
import axios from 'axios';
import cryptoJs from "crypto-js";
export default {
  layout: "system",
  mounted() {
    this.$nextTick(() => {
      this.$refs['codeInput'].focus()
    })
  },
  data() {
    /**
     * 表单校验自定义规则
     */
    const ValidateConfirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入确认密码'));
      } else if (value !== this.AlterPasswordForm.Password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      buttonText: '发送验证码',
      PersonInfoForm: {
        StudentID: this.$store.state.userId || "获取失败",
        StudentName: this.$store.state.userName || "获取失败",
        Class: this.$store.state.userClass || "获取失败",
        email: this.$store.state.email || "获取失败"
      },
      AlterPasswordForm: {
        EmailCode: "",
        Password: "",
        ConfirmPassword: ""
      },
      AlterPasswordFormValidate: {
        EmailCode: [{
          required: true,
          message: "请输入验证码",
          trigger: "blur"
        }],
        Password: [{
          required: true,
          message: "请输入密码",
          trigger: "blur"
        }],
        ConfirmPassword: [{
            required: true,
            message: "请输入确认密码",
            trigger: "blur"
          },
          {
            validator: ValidateConfirmPassword,
            trigger: "blur",
          }
        ]
      }
    }
  },
  methods: {
    sendEmailCode() {
      this.$refs['sendEmailCodeButton'].$el.setAttribute('disabled', 'true')
      axios({
        method: 'post',
        url: '/api/send-email-code'
      }).then((res) => {
        // console.log(res);
        if (res.status === 200 & res.data.success === true) {
          let second = 60
          let sendEmailCodeInterval = setInterval(() => {
            // console.log(second);
            if (second == 1) {
              this.buttonText = `发送验证码`
              clearInterval(sendEmailCodeInterval)
            } else {
              second--
              this.buttonText = `已发送 ${second}s`
            }
          }, 1000);
          setTimeout(() => {
            this.$refs['sendEmailCodeButton'].$el.removeAttribute('disabled')
          }, 1000 * 60);
        }
      })
    },
    /** 提交表单 */
    Submit(name) {
      this.$refs[name].validate(valid => {
        let FrontendEncryption = (cryptoJs.SHA1(this.AlterPasswordForm.ConfirmPassword)).toString();
        if (valid) {
          axios({
            method: "post",
            url: "/api/alter-password",
            data: {
              code: this.AlterPasswordForm.EmailCode,
              password: FrontendEncryption
            }
          }).then((res) => {
            if (res.status === 200 && res.data.success === true) {
              this.$Message.success('密码修改成功')
            } else {
              this.$Message.error(res.data.message)
            }
          }).catch((error) => {
            // console.log(error);
          })
        } else {
          this.$Message.error("请填写正确后再提交");
        }
      });
    },
    /** 重置表单 */
    Reset(name) {
      this.$refs[name].resetFields();
      this.$refs['codeInput'].focus()
    }
  }
};
</script>

<style lang="scss" scoped>
#person-center {
  padding: 10px;
}
</style>
