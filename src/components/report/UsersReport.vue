<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <!-- 2.放置区域 -->

      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-card class="box-card">
              <div id="main" class="userSex"></div>
            </el-card>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-light">
            <CateReport />
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <CreateTimeReport />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-light"></div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
//导入echarts
import echarts from 'echarts'
import _ from 'lodash'

import CreateTimeReport from './createTimeReport'

import CateReport from './cateReport'

export default {
  components: {
    CreateTimeReport,
    CateReport,
  },
  data() {
    return {
      newArr: [],
    }
  },
  // 元素已渲染完毕
  async mounted() {
    // 3.准备dom
    var myChart = echarts.init(document.getElementById('main'))
    const { data: res } = await this.$http.get('User/GetAll')
    if (res.code !== 200) return this.$messgae.error('获取折线图数据失败')
    var boy = 0
    var girl = 0
    res.data.map(function (item, index) {
      if (item.sex == 0) {
        boy++
      } else {
        girl++
      }
    })

    myChart.setOption({
      title: {
        text: '用户性别统计',
        subtext: '',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        left: 5,
        top: 0,
        data: ['男', '女'],
      },
      series: [
        {
          color: ['#d48265', '#91c7ae'],
          name: '性别分布',
          type: 'pie',
          radius: '55%',
          label: {
            formatter: '{b}: {@1} ({d}%)',
          },
          data: [
            // 数据数组，name 为数据项名称，value 为数据项值
            { value: boy, name: '男' },
            { value: girl, name: '女' },
          ],
        },
      ],
    })
  },
  methods: {},
}
</script>
<style scoped>
.userSex {
  width: 500px;
  height: 200px;
}
</style>