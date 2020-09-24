<template>
  <div>
    <el-card class="box-card">
      <!-- 2.放置区域 -->
      <div id="main" class="userSex"></div>
    </el-card>
  </div>
</template>

<script>
//导入echarts
import echarts from 'echarts'
import _ from 'lodash'
export default {
  data() {
    return {
      newArr: [],
    }
  },
  // 元素已渲染完毕
  mounted() {
    // 3.准备dom
    var myChart = echarts.init(document.getElementById('main'))

    myChart.setOption({
      backgroundColor: '#000',
      globe: {
        baseTexture: ROOT_PATH + '/data-gl/asset/earth.jpg',
        heightTexture:
          ROOT_PATH + '/data-gl/asset/bathymetry_bw_composite_4k.jpg',

        displacementScale: 0.1,

        shading: 'lambert',

        environment: ROOT_PATH + '/data-gl/asset/starfield.jpg',

        light: {
          ambient: {
            intensity: 0.1,
          },
          main: {
            intensity: 1.5,
          },
        },

        layers: [
          {
            type: 'blend',
            blendTo: 'emission',
            texture: ROOT_PATH + '/data-gl/asset/night.jpg',
          },
          {
            type: 'overlay',
            texture: ROOT_PATH + '/data-gl/asset/clouds.png',
            shading: 'lambert',
            distance: 5,
          },
        ],
      },
      series: [],
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