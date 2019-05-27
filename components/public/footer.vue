<template>
<Footer class="layout-footer-center">2018-{{this.year}} &copy; LanJu</Footer>
</template>

<script>
export default {
  data() {
    return {
      year: ""
    };
  },
  created() {
    this.year = new Date().getFullYear();
  }
};
</script>

<style lang="scss" scoped>
.ivu-layout-footer {
  padding-bottom: 0;
}

.layout-footer-center {
  text-align: center;
  padding-left: 0;
  padding-right: 0
}
</style>
