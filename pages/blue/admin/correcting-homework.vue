<template>
<section class="correcting-homework">
  <Row :gutter="10">

    <Col span="5">
    <Card>
      <p slot="title">选择要批改的作业</p>
      <selectHomework />
    </Card>
    </Col>

    <Col span="19">
    <Card>
      <p slot="title">批改情况</p>
      <Table :columns="column" :data="data"></Table>
    </Card>
    </Col>

    <Modal v-model="correcting" title="批改中" :mask-closable="false" footer-hide="false" fullscreen>
      <Row :gutter="10">
        <!-- 预览区 -->
        <Col span="16">
        <iframe src="http://localhost:4000/template-file/14251101208%E5%BB%96%E4%BF%8A%E5%AE%9D%E7%B3%BB%E7%BB%9F%E5%BC%80%E5%8F%91%E8%AF%B4%E6%98%8E%E4%B9%A6.pdf" class="view-iframe">
          </iframe>
        </Col>
        <!-- 批改区 -->
        <Col span="8">
        <Card class="score-card">
          <p slot="title">评分区</p>
          <Form ref="ScoreForm" :model="ScoreForm" :rules="ScoreForm" label-position="top">
            <FormItem label="学号">
              <Input :placeholder="ScoreForm.StudentID"></Input>
            </FormItem>
            <FormItem label="姓名">
              <Input :placeholder="ScoreForm.StudentName"></Input>
            </FormItem>
            <FormItem label="成绩">
              <Input-number :max="100" :min="0" v-model="ScoreForm.Score" required></Input-number>
            </FormItem>
            <FormItem label="评语">
              <Input v-model="ScoreForm.Comment" placeholder="请输入评语" type="textarea" :autosize="autosize"></Input>
            </FormItem>
            <FormItem>
              <Button type="primary">提交</Button>
              <Button type="default">清空</Button>
            </FormItem>
          </Form>
        </Card>
        </Col>
      </Row>
    </Modal>

  </Row>
</section>
</template>

<script>
import selectHomework from '@/components/teacher/selectHomework'
export default {
  layout: "system",
  components: {
    selectHomework
  },
  data() {
    return {
      correcting: true, //正在批改吗？false（默认）:true
      ScoreForm: {
        StudentID: "获取失败",
        StudentName: "获取失败",
        Score: "60",
        Comment: "获取失败"
      },
      autosize: {
        minRows: 3,
        maxRows: 9
      },
      column: [{
          title: 'Name',
          key: 'name'
        },
        {
          title: 'Age',
          key: 'age'
        },
        {
          title: 'Address',
          key: 'address'
        }
      ],
      data: [{
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park',
          date: '2016-10-03'
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'London No. 1 Lake Park',
          date: '2016-10-01'
        }
      ]

    }
  }
}
</script>

<style lang="scss" scoped>
.correcting-homework {
  padding: 10px;
}

.view-iframe {
  width: 100%;
  height: calc(100vh - 80px);
}

.score-card {
  box-shadow: 0 1px 6px rgba(0, 0, 0, .2);
  border-color: #eee;
}
</style>
