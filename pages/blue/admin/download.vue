<template>
<el-row>
  <el-col :span="24">

    <el-card class="box-card">
      <blockquote>

      </blockquote>
      <el-alert type="warning" :description="description" show-icon :closable="false">
      </el-alert>

      <br>

      <el-table :data="downloadTable" border style="width: 100%" size="small" :default-sort="{prop:'deadline',order:'descending'}">
        <el-table-column type="index" label="编号"></el-table-column>
        <el-table-column prop="subject" label="科目名称" sortable></el-table-column>
        <el-table-column prop="homeworkName" label="作业名称" sortable></el-table-column>
        <el-table-column prop="teacher" label="任课老师" sortable></el-table-column>
        <el-table-column prop="deadline" label="截止时间" sortable></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="detailData(scope.$index, scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <DetailData v-if="showDetailData" :showDetailData="showDetailData" @closeDialog="closeDialog" :searchArgument="searchArgument"></DetailData>

  </el-col>
</el-row>
</template>

<script>
import axios from 'axios'
import DetailData from './detail-data.vue'
export default {
  layout: "system",
  components: {
    DetailData
  },
  created() {
    this.getDownloadTable()
  },
  data() {
    return {
      description: `此处只展示未列入 “历史作业” 的作业，即 “最近作业” 。
        若下列表格中未出现你想下载的作业，说明它已经是 “历史作业” 了，需要你前往“管理控制台→作业管理”中切换一下作业状态。`,
      downloadTable: [],
      showDetailData: false,
      searchArgument: null
    }
  },
  methods: {
    closeDialog() {
      this.showDetailData = false;
    },
    detailData(index, row) {
      // console.log(index, row);
      this.showDetailData = true;
      this.searchArgument = row
    },
    getDownloadTable() {
      axios({
        method: 'get',
        url: '/api/recently-homework',
        params: {
          type: 0
        }
      }).then((response) => {
        // console.log(response);
        let mapResult = (response.data.result).map((item) => {
          return {
            _id: item._id,
            subject: item.subject,
            homeworkName: item.homework_name,
            teacher: item.teacher,
            deadline: item.deadline,
          }
        })
        this.downloadTable = mapResult
      })
    }
  }
}
</script>
