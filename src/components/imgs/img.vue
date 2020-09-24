<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>图片管理</el-breadcrumb-item>
      <el-breadcrumb-item>图片列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <!--表格区域-->
      <el-table :data="ImgsList" border stripe style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>

        <el-table-column label="图片" width="50px">
          <template slot-scope="scope">
            <el-image class="avatar"  :src="getImg(scope.row.url)" fit="fit"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180">
          <template slot-scope="scope">{{scope.row.createTime | dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="state" label="图片性质" width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state==0" type="primary">相片</el-tag>
            <el-tag v-else-if="scope.row.state==1" type="success">轮播图</el-tag>
            <el-tag v-else-if="scope.row.state==2" type="info">文章封面</el-tag>
            <el-tag v-else type="warning">头像</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="user.name" label="上传人" width="100"></el-table-column>
      </el-table>
      <!-- 分页区域 -->
   

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryModel.pageIndex"
        :page-sizes="[3,6,9]"
        :page-size="queryModel.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
import { catNameValid } from '../../common.js'
export default {
  data() {
    return {
      //查询条件
      queryModel: {
        isPage: true,
        pageIndex: 1,
        pageSize: 4,
      },

      url: 'http://localhost:8510/',
      //分类列表
      ImgsList: [],
      total: 0,

    
    }
  },
  created() {
    this.getImgsList()
  },
  methods: {
    //初始化数据
    async getImgsList() {
      const { data: res } = await this.$http.get('Imgs/GetAll', {
        params: this.queryModel,
      })
      if (res.code !== 200) return this.$message.error('获取图片列表失败')
      this.ImgsList = res.data.data;
      this.total=res.data.dataCount
      console.log(res)
    },

   
    async del(cate) {
      const { data: res } = await this.$http.delete(
        `Category/del?categoryId=${cate.id}`
      )
      if (res.code !== 200) {
        return this.$message.error('删除分类失败')
      }
      this.$message.success('删除分类成功')
      this.getImgsList()
    },
    getImg(imgUrl) {
      return this.url + imgUrl
    }, //分页
    handleSizeChange(newSize) {
      this.queryModel.pageSize = newSize
      this.getImgsList()
    },
    handleCurrentChange(newPage) {
      this.queryModel.pageIndex = newPage
      this.getImgsList()
    },
  },
}
</script>
<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>