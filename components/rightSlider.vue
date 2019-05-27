<template>
<section>

  <Card id="notice" v-show="ShowNotice">
    <p slot="title">通知</p>
    <a slot="extra" @click.prevent="ChangeView">
      切换到操作历史
    </a>
    <Timeline class="container">
      <TimelineItem v-for="item in Notice" :key="item._id">
        {{item.content}}
        <br>
        {{item.update_time}}
      </TimelineItem>
    </Timeline>
  </Card>

  <Card id="history" v-show="!ShowNotice">
    <p slot="title">操作历史</p>
    <a slot="extra" @click.prevent="ChangeView">
      切换到通知
    </a>
    <Timeline class="container">
      <TimelineItem v-for="item in Log" :key="item._id">
        <p class="time">{{item.insert_time}}</p>
        <p class="content">{{item.content}}</p>
      </TimelineItem>
    </Timeline>
  </Card>
</section>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      // 显示通知/操作历史？
      ShowNotice: true,
      /**
       * 通知
       * 操作历史
       */
      Notice: [],
      Log: [],
    }
  },
  methods: {
    ChangeView() {
      this.ShowNotice = !this.ShowNotice
    },

    /**
     * 获取操作历史   供created()调用   暂不启用
     */
    async GetLog() {
      let response = await axios({
        method: "get",
        url: "/api/my-log"
      });
      if (response.status != 200) {
        console.log('网络错误');
        return
      }
      if (response.data.success) {
        this.Log = response.data.result;
      } else {
        // this.$Message.error(response.data.message);
      }
    },

    /**
     * 获取通知   供created()调用   暂不启用
     */
    async GetNotice() {
      let response = await axios({
        method: "get",
        url: "/api/notice"
      });
      if (response.status != 200) {
        console.log('网络错误');
        return
      }
      if (response.data.success) {
        this.Notice = response.data.result;
      } else {
        // this.$Message.error(response.data.message);
      }
    }
  },
  created() {
    /**
     * 获取通知
     * 获取操作日志
     **/
    this.GetNotice();
    this.GetLog();
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: calc(100vh - 170px);
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
