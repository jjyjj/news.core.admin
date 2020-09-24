<template>
  <div>
    <el-card class="box-card">
      <!-- 2.放置区域 -->
      <div id="main2" class="userSex"></div>
    </el-card>
  </div>
</template>
<script>
//导入echarts
import echarts from 'echarts'
import _ from 'lodash'

export default {
  components: {},
  data() {
    return {
      newArr: [],
      countArr: [],
      ss: [],
    }
  },
  // 元素已渲染完毕
  async mounted() {
    // 3.准备dom
    var myChart = echarts.init(document.getElementById('main2'))
    const { data: res } = await this.$http.get('Category/getAll')
    if (res.code !== 200) return this.$messgae.error('获取折线图数据失败')
    var catesList = res.data

    this.newArr = res.data.map(function (item, index) {
      return item.name
    })
  

    for (let index = 0; index < this.newArr.length; index++) {
      const { data: ress } = await this.$http.get(
        `News/GetAllByCategory?categoryName=${this.newArr[index]}`
      )
      if (ress.code !== 200) return this.$messgae.error('获取折线图数据失败')

      this.countArr[index] = ress.data.dataCount
    }
    var obj = this.newArr.map((item, index) => {
      return { name: item, value: this.countArr[index] }
    })
    console.log(obj)
    myChart.setOption({
      title: {
        text: '类别使用次数统计',
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
        right: 5,
        top: 0,
    
        data: this.newArr,
      },
      series: [
        {
          name: '类别引用次数',
          type: 'pie',
          radius: '55%',
          data: obj,
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