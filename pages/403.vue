<template>
<div class="page-403-vue">
  <div class="background-image"></div>
  <p>您无权访问此页面~~</p>
  <br>
  <Button type="primary" size="large" @click="toLogin">返回登录页</Button>
</div>
</template>

<script>
export default {
  methods: {
    toLogin() {
      this.$router.push('/login')
    }
  }
};
</script>

<style lang="scss">
.page-403-vue {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-top: -200px;
  margin-left: -150px;
  height: 300px;
  width: 300px;
  text-align: center;

  .background-image {
    background: url("./../assets/403.png");
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
