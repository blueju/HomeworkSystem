<style lang="scss">
.page-404-vue {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-top: -200px;
  margin-left: -150px;
  height: 300px;
  width: 300px;
  text-align: center;

  .background-image {
    background: url(../assets/404.png);
    height: 300px;
    max-width: 500px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    margin: 0 auto 50px;
  }

  p {
    font-size: 22px;
    color: #3788ee;
  }
}
</style>
<template>
<div class="page-404-vue">
  <div class="background-image"></div>
  <p>您访问的页面不存在~~</p>
  <Button type="primary" size="large" @click="toLogin">返回登录页</Button>
</div>
</template>

<script>
export default {
  name: "error",
  props: ["error"],
  // layout:'default',
  methods: {
    toLogin() {
      this.$router.push('/login')
    }
  }
};
</script>
