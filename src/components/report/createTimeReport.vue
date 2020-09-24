<template>
  <div>
    <el-card class="box-card">
      <!-- 2.放置区域 -->
      <div id="main1" class="userSex"></div>
    </el-card>
  </div>
</template>
<script>
//导入echarts
import echarts from 'echarts'
import _ from 'lodash'
import moment from 'moment'
export default {
  data() {
    return {
      newArr: [],
      newArr1: [],
    }
  },
  // 元素已渲染完毕
  mounted() {
    this.getData()
  },
  methods: {
    getDateList(count, long) {
      var time = new Date().setMinutes(0)
      time = time - 24 * 60 * 60 * 1000
      var categoryData = []
      for (var i = 0; i <= count; i++) {
        categoryData.push(moment(time).format('YYYY-MM-DD'))
        time += long
      }
      return categoryData
    },

    async getData() {
      //3.准备dom
      var myChart = echarts.init(document.getElementById('main1'))
      const { data: res } = await this.$http.get('User/GetAll')
      if (res.code !== 200) return this.$messgae.error('获取折线图数据失败')
      var count = 0

      this.newArr1 = res.data.map(function (item, index) {
        var ss = moment(item.createTime).format('YYYY-MM-DD')
      
      })
  
      myChart.setOption({
        title: {
          text: '用户创建时间统计',
          subtext: '',
          left: 'center',
        },
        xAxis: {
          type: 'category',
          data: this.getDateList(7, 24 * 60 * 60 * 1000),
        },
        yAxis: {
          type: 'value',
        },

        series: [
          {
            data: [1, 4, 3, 5, 6, 1, 111],
            type: 'line',
          },
        ],
      })
    },
  },
}
</script>
<style scoped>
.userSex {
  width: 500px;
  height: 400px;
}
</style>