<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>文章列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryModel.query"
            clearable
            @clear="getArticleList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getArticleList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGood">新增文章</el-button>
        </el-col>
      </el-row>
      <el-table :data="articlesList" border stripe>
        <el-table-column type="index"></el-table-column>     <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="商品名称">1212</el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="封面" width="80px">
          <template slot-scope="scope">
            <el-image  :src="getImg(scope.row.imagePath)" fit="fit"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" width="120px"></el-table-column>
        <el-table-column prop="browseCOunt" sortable label="浏览量" width="100px"></el-table-column>
        <el-table-column sortable prop="createTime" label="创建时间" width="140px">
          <template slot-scope="scope">{{scope.row.createTime | dateFormat}}</template>
        </el-table-column>
        <el-table-column sortable prop="lastChangTime" label="最后修改时间" width="140px">
          <template slot-scope="scope">{{scope.row.lastChangTime | dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="state" label="状态" width="140px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state==0" type="success">已发布</el-tag>
            <el-tag v-else-if="scope.row.state==1" type="warning">草稿箱</el-tag>
            <el-tag v-else type="danger">回收站</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="user.name" label="作者" width="140px"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 查看按钮 -->
            <el-tooltip effect="dark" content="查看详情" placement="top" :enterable="false">
              <el-button type="primary " icon="el-icon-view" size="mini" @click="goDetials(scope.row)"></el-button>
            </el-tooltip>
            <!-- 修改按钮 -->
            <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="warning " icon="el-icon-edit" size="mini" @click="goEdit(scope.row)"></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="delByArticleId(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        :page-sizes="[ 5, 10,15,20]"
        :page-size="queryModel.pageSize"
        :current-page="queryModel.pageIndex"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryModel: {
        isPage: true,
        pageIndex: 1,
        pageSize: 2,
      },
      goodList: [],
      total: 0,
      articlesList: [],
      url: 'http://localhost:8510/',
    }
  },
  created() {
    this.getArticleList()
  },
  methods: {
    //获取所有商品数量
    async getArticleList() {
      const { data: res } = await this.$http.get('News/GetAll', {
        params: this.queryModel,
      })
      if (res.code !== 200) return this.$message.error('获取文章列表失败')
      this.articlesList = res.data.data
      this.total = res.data.dataCount

      console.log(res.data)
    },
    //分页
    handleSizeChange(newSize) {
      this.queryModel.pageSize = newSize
      this.getArticleList()
    },
    handleCurrentChange(newPage) {
      this.queryModel.pageIndex = newPage
      this.getArticleList()
    },
    //删除商品
    delByArticleId(article) {
      const confirmResult = this.$confirm(
        '此操作将删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      // if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      // const { data: res } = await this.$http.delete(`goods/` + id)
      // if (res.code !== 200) return this.$message.errot('删除用户失败')
      // this.$message.success('成功删除用户')
      // this.getArticleList()
    },
    //查看
    goDetials(article) { window.open(`http://localhost:8081/#/NewsDetails?newsId=${article.id}`)},
    //编辑
    goEdit(article) {
      window.open(`http://localhost:8081/#/EditArticle?newsId=${article.id}`)
    },
    //添加
    addGood() {
      window.open(`http://localhost:8081/#/AddArticle`)
    },
    getImg(imgUrl) {
      return this.url + imgUrl
    },
  },
}
</script>
<style lang="less" scoped>
.avatar {
  margin-left: 10px;
  cursor: pointer;
  width: 80px;
  height: 80px;
}
</style>