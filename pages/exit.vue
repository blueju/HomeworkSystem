<template>
<div></div>
</template>

<script>
import axios from "axios";
export default {
  layout: "default",
  mounted() {
    axios({
        method: "get",
        url: "/api/exit"
      })
      .then(res => {
        if (res.data.success) {
          this.$Message.success({
            content: "退出成功",
            duration: 1
          });
          this.$store.dispatch('deleteUserInfo');
          this.$router.push("/login");
        } else {
          this.$Message.warning("退出失败");
          this.$router.push("/login");
        }
      })
      .catch(err => {
        // console.log(err);
      });
  }
};
</script>
