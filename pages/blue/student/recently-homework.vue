<template>
<section class="recently-homework">
  <Row :gutter="10">

    <Col span="14">
    <Card>
      <p slot="title">作业详情</p>
      <Collapse v-model="DefaultOpen" accordion>
        <Panel v-for="(item,index) in RecentlyHomeworkList" @click.native="Choose(item)">
          <label>{{item.subject}} 🚀 {{item.homework_name}}</label>
          <div slot="content">
            <CellGroup>
              <Cell title="课程名称 👨‍🎓" :extra="item.subject" />
              <Cell title="教师姓名 👨🏻‍🏫" :extra="item.teacher" />
              <Cell title="作业名称 📚" :extra="item.homework_name" />
              <Cell title="截止时间 ⏳" :extra="item.deadline" />
              <Cell title="资料下载 📥" v-if="item.template_path==='无'" extra="无" class="template_download" />
              <Cell title="资料下载 📥" v-else :to='item.template_path' extra="点击前往下载" class="template_download" target="_blank" />
            </CellGroup>
            <section class="others">
              <ul>
                <li>
                  <label>作业要求 📝</label>
                  <Input
                      v-model="item.remark"
                      type="textarea"
                      readonly
                      :autosize="{minRows: 5,maxRows: 14}"
                    ></Input>
                </li>
                <li>
                  <Row>
                    <Col span="12">
                    <label>提交作业</label>
                    <Button
                        class="disabledUploadButton"
                        type="error"
                        icon="ios-cloud-upload-outline"
                        v-if="(new Date).getTime()>Date.parse(item.deadline)"
                      >已过作业提交时间</Button>

                    <Upload ref="uploadHomework" :action="'/api/upload-homework?suffix='+item.suffix+'&subject='+item.subject+'&name='+item.homework_name+'&teacher='+item.teacher" accept=".docx" :format="['docx']" :on-format-error="HandleFormatError" :before-upload="BeforUpload" :on-success="AfterSuccessUpload">
                      <Button
                          type="primary"
                          icon="ios-cloud-upload-outline"
                          v-if="(new Date).getTime()<Date.parse(item.deadline)"
                          @click.native="changeUploadIndex(index)"
                        >上传作业</Button>
                    </Upload>
                    <div v-if="File !== null">
                      <Button type="text">上传文件: {{ File.name }}</Button>
                      <Button type="dashed" @click="ConfirmUpload" :loading="UploadLoading">{{ UploadLoading ? '上传中...' : '点击确认上传' }}</Button>
                    </div>

                    </Col>
                    <Col span="12">
                    <p>下载作业</p>
                    <Button
                        type="success"
                        icon="ios-download-outline"
                        :loading="loading"
                        @click="DownloadHomework(index)"
                      >下载作业</Button>
                    </Col>
                  </Row>
                </li>
              </ul>
            </section>
          </div>
        </Panel>
      </Collapse>
    </Card>
    </Col>

    <!-- 作业提交记录 -->
    <Col span="5">
    <homeworkUploadHistory :props_CurrentCollapseData='props_CurrentCollapseData' />
    </Col>

    <!-- 通知和操作历史 -->
    <Col span="5">
    <rightSlider />
    </Col>

  </Row>
</section>
</template>

<script>
import axios from "axios";

import homeworkUploadHistory from "./../../../components/homeworkUploadHistory"; // 作业提交历史组件
import rightSlider from "./../../../components/rightSlider.vue"; //通知和操作历史组件
import {
  Promise
} from 'q';

export default {
  layout: "system",
  // middleware: 'shenfen-validate',
  components: {
    homeworkUploadHistory,
    rightSlider
  },
  created() {
    /**
     * 获取作业
     **/
    this.GetRecentlyHomework().then(() => {
      this.GetHomeworkUploadHistory();
    });
  },
  mounted() {
    console.log(window.location);

  },
  data() {
    return {
      // 临时存储文件
      File: null,
      // 上传状态（上传中/点击上传）
      UploadLoading: false,
      // 下载作业按钮 loading 状态
      loading: false,
      // 上传哪个（索引值）
      UploadIndex: "",
      //手风琴面板默认打开第几个
      DefaultOpen: "1",
      /**
       * 最近作业列表
       */
      RecentlyHomeworkList: [],
      /**
       * 手风琴折叠面板中当前面板的数据
       */
      CurrentCollapseData: [],
      props_CurrentCollapseData: []
    };
  },
  methods: {
    Choose(item) {
      /**
       * CurrentCollapse存储当前所在面板的作业数据
       */
      if (this.CurrentCollapse._id != item._id) {
        this.CurrentCollapse = item;
        this.GetHomeworkUploadHistory();
      }
    },

    /**
     * 中转站，保存要上传的文件的索引值（即第几个）
     */
    changeUploadIndex(index) {
      console.log("点击了上传按钮");
      console.log(index);
      this.UploadIndex = index;
      console.log(this.UploadIndex);
    },

    /**
     * 选择文件后，确认上传前
     * 确认上传
     * 成功上传后
     * 检查到上传文件格式不符合要求时
     */
    BeforUpload(file) {
      console.log("文件信息", file);
      console.log("上传索引", this.UploadIndex);
      this.File = file;
      return false;
    },
    ConfirmUpload() {
      this.UploadLoading = true;
      console.log("uploadIndex:", this.UploadIndex);
      console.log("确认上传的对象this", this);
      console.log("确认上传的对象this.$refs", this.$refs);
      this.$refs.uploadHomework[this.UploadIndex].post(this.File);
    },
    AfterSuccessUpload() {
      this.File = null;
      this.$Message.success('作业已成功上传');
      this.UploadLoading = false;
      this.GetHomeworkUploadHistory();
    },
    HandleFormatError() {
      this.UploadLoading = false;
      this.$Notice.error({
        title: '格式错误',
        desc: '选择的文件格式不符合要求，请选择docx格式的文件！'
      });
    },

    /**
     * 下载作业
     */
    async DownloadHomework(index) {
      let Subject = this.RecentlyHomeworkList[index].subject;
      let HomeworkName = this.RecentlyHomeworkList[index].homework_name;

      let response = await axios({
        method: 'get',
        url: '/api/download-homework',
        params: {
          subject: Subject,
          name: HomeworkName,
          type: 0
        }
      })
      if (response.status != 200) {
        console.log("网络故障");
        return;
      }
      if (response.data.success === false) {
        this.$Message.warning(response.data.message);
        return;
      }
      let fileName = response.data.result[0].new_file_name;

      let path = `${Subject}/${HomeworkName}/word/`
      let downloadHref = path + fileName;
      window.open("http://" + window.location.hostname + ":3001/homework/" + downloadHref);
      this.$Message.warning({
        content: "如果没有弹出下载窗口，可能是浏览器拦截，请自行解除一下",
        duration: 6
      });
    },

    /**
     * 获取最近作业   供created()调用
     */
    GetRecentlyHomework() {
      return new Promise((resolve, reject) => {
        axios({
          method: "get",
          url: "/api/recently-homework",
          params: {
            type: 0
          }
        }).then((res) => {
          if (res.data.success) {
            this.RecentlyHomeworkList = res.data.result
            this.CurrentCollapse = res.data.result[0];
            /**
             * 重要
             * 什么意思自己看下吧，有点难描述
             * 大致意思就是：一开始手风琴面板没数据，这时候设置打开第几个是无效的，因此需要等有数据了再设置
             */
            this.$nextTick(() => {
              this.DefaultOpen = "0";
            });
            resolve()
          } else {
            console.log('获取最近作业信息失败');
          }
        });

      })
    },

    /**
     * 请求作业提交记录
     */
    GetHomeworkUploadHistory() {
      let response = axios({
        method: "get",
        url: "/api/homework-upload-history",
        params: {
          // subject: "管理信息系统开发与设计",
          // homework_name: "系统开发说明书"
          subject: this.CurrentCollapse.subject,
          homework_name: this.CurrentCollapse.homework_name
        }
      });
      response
        .then(res => {
          if (res.data.success) {
            this.props_CurrentCollapseData = res.data.result;
          } else {
            // this.$Message.warning(res.data.message); //你未提交过该作业
            this.props_CurrentCollapseData = []
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
.recently-homework {
  padding: 10px;
}

#home-info {
  padding: 10px;
}

#history {
  max-height: 780px;
  overflow-y: scroll;
}

#noticeCard {
  /* max-height: 180px; */
}

.disabledUploadButton {
  position: absolute;
  left: 0px;
  top: 21px;
}

.time {
  font-size: 14px;
  font-weight: bold;
}

.content {
  padding-left: 5px;
}

.others {
  padding-left: 16px;
}

.others>ul {
  list-style: none;
}

.others>ul>li {
  padding-top: 7px;
  padding-bottom: 7px;
}
</style>
