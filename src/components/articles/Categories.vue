<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary" @click="showCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!--表格区域-->
      <el-table :data="catesList" border stripe style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>

        <el-table-column prop="name" label="名称" width="180"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180">
          <template slot-scope="scope">{{scope.row.createTime | dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="state" label="是否有效" width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isRemove==0" type="success">
              <i class="el-icon-check"></i>
            </el-tag>
            <el-tag v-else type="danger">
              <i class="el-icon-close"></i>
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="userId" label="处理人" width="100"></el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
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
                @click="del(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加分类的对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        width="50%"
        @close="addCateDialogClosed"
      >
        <!-- 内容主体区域 -->
        <el-form
          status-icon
          ref="addCateFormRef"
          label-width="100px"
          :model="addCateForm"
          :rules="addCateFormRules"
        >
          <el-form-item label="分类名称:" prop="categoryName">
            <el-input v-model="addCateForm.categoryName"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 添加分类的对话框 -->
      <el-dialog
        title="修改分类"
        :visible.sync="editCateDialogVisible"
        width="50%"
        @close="editCateDialogClosed"
      >
        <!-- 内容主体区域 -->
        <el-form
          status-icon
          ref="editCateFormRef"
          label-width="100px"
          :model="editCateForm"
          :rules="editCateFormRules"
        >
          <el-form-item label="分类名称:" prop="categoryName">
            <el-input v-model="editCateForm.categoryName"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCate">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import { catNameValid } from '../../common.js'
export default {
  data() {
    return {
      //查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //分类列表
      catesList: [],
      total: 0,

      //添加分类
      addCateDialogVisible: false,
      addCateForm: {},
      addCateFormRules: { categoryName: catNameValid },

     
      //修改分类
      editCateDialogVisible: false,
      editCateForm: {},
      editCateFormRules: { categoryName: catNameValid },
    }
  },
  created() {
    this.getCatesList()
  },
  methods: {
    //初始化数据
    async getCatesList() {
      const { data: res } = await this.$http.get('Category/getAll')
      if (res.code !== 200) return this.$message.error('获取分类列表失败')
      this.catesList = res.data
      console.log(res)
      this.total = res.data.length
    },

    //添加分类
    showCateDialog() {
      this.addCateDialogVisible = true
    },
    addCate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return

        //添加
        const { data: res } = await this.$http.post(
          `Category/Add?categoryName=${
            this.addCateForm.categoryName
          }&&userId=${parseInt(sessionStorage.getItem('userId'))}`
        )
        if (res.code !== 200) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')

        this.getCatesList()
        this.addCateDialogVisible = false
      })
    },
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
    },

    goEdit(cate) {
      this.editCateDialogVisible = true
      this.editCateForm.id = cate.id
    },
    editCateDialogClosed() {
      this.$refs.editCateFormRef.resetFields()
    },
    editCate() {
      this.$refs.editCateFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `Category/update?categoryName=${this.editCateForm.categoryName}&&categoryId=${this.editCateForm.id}`
        )
        if (res.code !== 200) {
          return this.$message.error('修改分类失败')
        }
        this.$message.success('修改分类成功')
        this.getCatesList()
        this.editCateDialogVisible = false
      })
    },
    async del(cate) {
      const { data: res } = await this.$http.delete(
        `Category/del?categoryId=${cate.id}`
      )
      if (res.code !== 200) {
        return this.$message.error('删除分类失败')
      }
      this.$message.success('删除分类成功')
      this.getCatesList()
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