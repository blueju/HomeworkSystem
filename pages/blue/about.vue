<template>
<section class='about'>
  <Row>
    <Col :xs="{span:24}" :sm="{span:24}" :md="{span:18,offset:3}" :lg="{span:14,offset:5}">
    <Card>
      <no-ssr>
        <i-editor class="editor" v-model="about" :autosize="{minRows:5}" :change-scroll="true"></i-editor>
      </no-ssr>
    </Card>
    </Col>
  </Row>
</section>
</template>

<script>
import axios from "axios";
export default {
  layout: "system",
  data() {
    return {
      about: ""
    };
  },
  created() {
    axios({
      method: "get",
      url: "/api/about"
    }).then(res => {
      // console.log(res);
      if (res.status === 200 && res.data.success === true) {
        this.about = res.data.message;
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.about {
  padding-top: 20px;
  padding-bottom: 20px;
}
</style>
