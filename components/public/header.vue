<template>
<Header>
  <Menu mode="horizontal" theme="dark" active-name="1">
    <div class="layout-title">
      <p>学生作业管理系统</p>
    </div>
    <div class="layout-nav">
      <MenuItem name="1">
      <Icon type="ios-contact" />
      {{this.$store.state.userId}}
      </MenuItem>
      <MenuItem name="2">
      <Icon type="logo-freebsd-devil" />
      {{this.$store.state.userName}}
      </MenuItem>
      <MenuItem name="3">
      <Icon type="md-contacts" />
      {{this.$store.state.userClass}}
      </MenuItem>
    </div>
  </Menu>
</Header>
</template>

<script>
export default {
  data() {
    return {
      
    }
  }
}
</script>

<style lang="scss" scoped>
.layout-title {
  position: relative;
  top: 15px;
  left: 20px;

  float: left;

  height: 30px;

  border-radius: 3px;
  background: #5b6270;
  line-height: 30px;
  color: #fff;
  font-size: 22px;
}

.layout-nav {
  float: right;
  width: auto;
  margin: 0 auto;
  margin-right: 20px;
}
</style>
