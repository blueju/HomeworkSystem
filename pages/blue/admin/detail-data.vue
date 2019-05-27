<template>
<!-- :visible.sync="" -->
<el-dialog title="作业收集详情" :visible.sync="showDiglog" width="98%" :close-on-press-escape="true" :close-on-click-modal="false" :before-close="closeDialog" :fullscreen="true">

  <el-row :gutter="10">
    <el-col :span="8">
      <el-card>
        <span slot="header">统计数据</span>
        <el-row>
          <p>进度</p><br>
          <!-- <section id="one" style="height:300px"></section> -->
          <el-progress :text-inside="true" :stroke-width="18" :percentage="percent" :status="status"></el-progress>

        </el-row>
      </el-card>
    </el-col>
    <el-col :span="16">
      <el-card>
        <span slot="header">详细信息与操作</span>
        <el-form label-width="120px" label-position="right" :inline="true">
          <el-form-item label="科目名称">
            <el-input :placeholder="searchArgument.subject" disabled></el-input>
          </el-form-item>
          <el-form-item label="作业名称">
            <el-input :placeholder="searchArgument.homeworkName" disabled></el-input>
          </el-form-item>
          <el-form-item label="任课老师">
            <el-input :placeholder="searchArgument.teacher" disabled></el-input>
          </el-form-item>
          <el-form-item label="全班总人数">
            <el-input :placeholder="homeworkSubmitDetail.studentNumber" disabled></el-input>
          </el-form-item>
          <el-form-item label="已提交人数">
            <el-input :placeholder="homeworkSubmitDetail.submited" disabled></el-input>
          </el-form-item>
          <el-form-item label="未提交人数">
            <el-input :placeholder="homeworkSubmitDetail.noSubmit" disabled></el-input>
          </el-form-item>
        </el-form>
        <section style="text-align:center">
          <el-button type="danger" @click="toggleNoSubmitStudentDialog" plain>查看未提交同学</el-button>
          <el-button type="primary" @click="downloadZip" plain>打包下载</el-button>
          <!-- <el-button type="success" @click="" plain>单独下载</el-button> -->
        </section>
      </el-card>
    </el-col>
  </el-row>

  <el-dialog title="未提交作业的同学" v-if="showNoSubmitStudent" :visible.sync="showNoSubmitStudent" width="50%" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="toggleNoSubmitStudentDialog" append-to-body>

    <el-table :data="homeworkSubmitDetail.allStudentList" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="studentId" label="学号" sortable></el-table-column>
      <el-table-column prop="studentName" label="姓名" sortable></el-table-column>
      <el-table-column prop="whateverSubmited" label="是否提交" sortable></el-table-column>
    </el-table>

    <span slot="footer">
    <el-button @click="toggleNoSubmitStudentDialog">关 闭</el-button>
  </span>
  </el-dialog>

  <!-- <br>
  <el-row>
    <el-col :span="24">
      <el-card>
        <el-tabs v-model="first">
          <el-tab-pane label="作业提交曲线" name="first">
            作业提交曲线
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>
  </el-row> -->

  <div slot="footer" class="dialog-footer">
    <el-button @click="closeDialog" type="primary">关闭</el-button>
  </div>
</el-dialog>
</template>

<script>
import axios from "axios";
// import echarts from 'echarts'
// 引入基本模板
// let echarts = require('echarts/lib/echarts')
// 引入提示框和title组件
// require('echarts/lib/component/tooltip')
// require('echarts/lib/component/title')
// 引入柱状图
// require('echarts/lib/chart/bar');
// 引入仪表盘组件
// require("echarts/lib/chart/gauge");

export default {
  layout: "default",
  props: {
    showDetailData: Boolean,
    searchArgument: Object
  },
  created() {
    console.log('created生命周期');
    this.getHomeworkSubmitDetail()
    // 短轮询
    this.lunxun = setInterval(() => {
      this.getHomeworkSubmitDetail()
    }, 3000)
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.print()
    // })
    // this.print()
  },
  computed: {
    showDiglog() {
      return this.showDetailData;
    }
    // getDetailData() {
    //   this.homeworkSubmitDetail.studentNumber = response.data.studentNumber
    //   this.homeworkSubmitDetail.submited = response.data.submited
    //   this.homeworkSubmitDetail.noSubmit = response.data.noSubmit
    //   // console.log('执行');
    //   // let {
    //   //   subject,
    //   //   homeworkName
    //   // } = this.searchArgument
  },
  data() {
    return {
      percent: 0,
      status: null,
      lunxun: null,
      showNoSubmitStudent: false,
      homeworkSubmitDetail: {
        studentNumber: null, //总人数
        submited: null, //已提交人数
        noSubmit: null, //未提交人数
        allStudentList: [], //所有同学名单
        // noSubmitedList: [], //未提交同学名单
        // submitedList: [] //已提交同学名单
      }
    };
  },
  methods: {
    print() {
      // debugger
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('one'));
      // console.log(myChart);

      // 绘制图表
      myChart.setOption({
        tooltip: {
          formatter: "{a} <br/>{b} : {c}%"
        },
        toolbox: {
          feature: {
            restore: {},
            saveAsImage: {}
          }
        },
        series: [{
          name: '业务指标',
          type: 'gauge',
          detail: {
            formatter: '{value}%'
          },
          data: [{
            value: 50,
            name: '完成率'
          }]
        }]
      });
    },
    // 开启/关闭 “未提交作业同学名单”的对话框
    toggleNoSubmitStudentDialog() {
      this.showNoSubmitStudent = !this.showNoSubmitStudent
    },
    // 关闭对话框
    closeDialog() {
      clearInterval(this.lunxun)
      this.$emit("closeDialog");
    },
    //获取作业提交详细数据（如：总人数、已交人数、未交人数、未交人员名单）
    getHomeworkSubmitDetail() {

      axios({
        method: 'get',
        url: '/api/submit-detail',
        params: {
          _id: this.searchArgument._id,
          subject: this.searchArgument.subject,
          homeworkName: this.searchArgument.homeworkName,
        }
      }).then((response) => {

        // console.log(response);
        // debugger
        this.homeworkSubmitDetail.studentNumber = response.data.result.totalNumber //总人数
        this.homeworkSubmitDetail.submited = response.data.result.submitedNumber //已提交人数
        this.homeworkSubmitDetail.noSubmit = response.data.result.noSubmitedNumber //未提交人数
        // this.homeworkSubmitDetail.submitedList = response.data.result.submitedList //提交名单（自己在前端用算法算出谁没交）
        this.percent = Math.floor((this.homeworkSubmitDetail.submited / this.homeworkSubmitDetail.studentNumber) * 100)
        // console.log(this.percent);
        if (this.percent <= 10) {
          this.status = 'exception'
        }
        if (this.percent >= 100) {
          this.status = 'success'
        }
        /**
         * 算法，对比全班名单和已交人员名单，计算出未交人员名单
         */
        let mapResult = null;
        //已提交
        mapResult = (response.data.result.submitedList).map((item) => {
          return {
            studentId: item.student_id,
            studentName: item.student_name,
          }
        })
        let submitedStudentList = mapResult //全班同学名单
        mapResult = null

        //全部人
        mapResult = (response.data.result.totalList).map((item) => {
          return {
            studentId: item.id,
            studentName: item.name,
            whateverSubmited: '✘'
          }
        })
        let allStudentList = mapResult //全班同学名单
        mapResult = null

        let noSubmitedStudentList = []

        let allStudentList_studentId = []
        allStudentList.forEach((item) => {
          allStudentList_studentId.push(item.studentId)
        });
        let submitedStudentList_studentId = []
        submitedStudentList.forEach((item) => {
          submitedStudentList_studentId.push(item.studentId)
        });

        for (let i = 0; i < allStudentList.length; i++) {
          // for (let j = 0; j < submitedStudentList.length; j++) {
          //   if (allStudentList[i].studentId)
          // }
          if (submitedStudentList_studentId.includes(allStudentList[i].studentId)) {
            allStudentList[i].whateverSubmited = '✅'
          } else {
            allStudentList[i].whateverSubmited = '❌'
          }
        }
        this.homeworkSubmitDetail.allStudentList = allStudentList

        // debugger
        // for (let i = 0; i < allStudentList.length; i++) {

        //   if (Object.values(submitedStudentList).includes([].prototype.push(allStudentList[i]))) {

        //   } else {
        //     noSubmitedStudentList.push(allStudentList[i])
        //   }
        // }
        // console.log(noSubmitedStudentList);

        // let noSubmitedStudentList = submitedStudentList.concat(allStudentList).filter((currentValue, index, arr) => {
        //   return arr.indexOf(currentValue) === arr.lastIndexOf(currentValue)
        // })

        // for (let j = 0; j < allStudentList.length; j++) {
        //   if (!(submitedList.toString().includes(allStudentList[j].toString()))) {
        //     noSubmitedList.push(allStudentList[j])
        //   }
        // }
        // this.homeworkSubmitDetail.noSubmitedList = noSubmitedList
      })
    },
    //下载打包作业
    downloadZip() {
      this.$notify({
        title: '打包提示',
        dangerouslyUseHTMLString: true,
        message: '打包所需时长视已提交作业量的大小而定。<br/> 可能需要等待一段时间。'
      });
      axios({
        method: 'post',
        url: '/api/zip',
        data: {
          subject: this.searchArgument.subject,
          homeworkName: this.searchArgument.homeworkName
        }
      }).then((res) => {
        console.log(res);
        if (res.status === 200) {
          window.open(res.data.data.url, '_blank')
        } else {
          this.$message.info('下载出错')
        }
      }).catch((err) => {
        this.$message.info('下载出错')
      })
      // let data = this.searchArgument
      // if(){
      //   this.$me
      //   return false
      // }
      // axios({
      //   method:'get',
      //   url:'/api/',
      //   params:data
      // })
    }
  }
};
</script>
