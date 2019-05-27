<template>
<Card>
  <p slot="title">作业提交记录</p>
  <Timeline class="container">
    <Alert v-if="props_CurrentCollapseData.length===0" show-icon>
      未提交过该作业
    </Alert>
    <TimelineItem v-for="(item,index) in HomeworkUploadHistory" :key="item.id">
      <span>版本：</span>{{item.version}}<br>
      <span>作业名称：</span>{{item.homework_name}}<br>
      <span>提交时间：</span>{{item.upload_time}}<br>
      <p>{{item.new_file_name}}</p>
      <Button
          type="success"
          @click="DownloadHomework(item.subject,item.homework_name,item.version)"
        >下载</Button>
      <Button
          type="error"
          v-if="index!=0"
          @click="DeleteHomework(item.subject,item.homework_name,item.version)"
        >删除</Button>
    </TimelineItem>
  </Timeline>
</Card>
</template>

<script>
import axios from "axios";
export default {
  props: {
    props_CurrentCollapseData: Array
  },
  data() {
    return {
      // HomeworkUploadHistory: [],
      CurrentCollapseData: {}
    };
  },
  computed: {
    HomeworkUploadHistory(val) {
      return this.props_CurrentCollapseData
    }
  },
  methods: {
    // 下载作业
    async DownloadHomework(subject, homework_name, version) {
      let Subject = subject;
      let HomeworkName = homework_name;

      let response = await axios({
        method: "get",
        url: "/api/download-homework",
        params: {
          subject: Subject,
          name: HomeworkName,
          version,
          type: 1
        }
      });
      if (response.status != 200) {
        console.log("网络故障");
        return;
      }
      if (response.data.success === false) {
        this.$Message.warning(response.data.message);
        return;
      }
      window.open("http://localhost:3001/homework/" + response.data.filePath);
      this.$Message.warning({
        content: "如果没有弹出下载窗口，可能是浏览器拦截，请自行解除一下",
        duration: 6
      });
    },
    // 删除作业
    async DeleteHomework(subject, homework_name, version) {
      let response = axios({
        method: "get",
        url: "/api/delete-homework-file",
        params: {
          subject: subject,
          homework_name: homework_name,
          version: version,
        }
      });
      response
        .then(res => {
          if (res.data.success) {
            this.$Message.warning({
              content: res.data.message,
              duration: 5
            });
          } else {
            this.$Message.warning(res.data.message);
          }
        })
        .catch(err => {
          console.log("网络错误");
        });
    }

  }
};
</script>

<style lang="scss" scoped>
.container {
  height: calc(100vh - 170px);
  overflow-x: hidden;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  span {
    font-weight: 600;
    color: #515a6e;
  }

  p {
    line-height: 22px;
    text-decoration: underline;
  }
}
</style>
