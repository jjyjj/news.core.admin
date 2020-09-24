<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-button type="primary" >导出数据</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table
        :data="userList.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase())|| data.email.toLowerCase().includes(search.toLowerCase()))"
        border
        stripe
      >
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="头像" width="50px">
          <template slot-scope="scope">
            <el-image style=" cursor: pointer" :src="getImg(scope.row.imgUrl)" fit="fit"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="邮箱" prop="email" width="180px"></el-table-column>
        <el-table-column label="创建时间" prop="createTime">
          <template slot-scope="scope">{{scope.row.createTime | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="性别">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.sex==0">男</el-tag>
            <el-tag type="danger" v-else>女</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="出生日期" prop="birthday">
          <template slot-scope="scope">{{scope.row.birthday | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="地址" prop="adress" width="150px"></el-table-column>
        <el-table-column label="电话" prop="phone"></el-table-column>

        <el-table-column label="状态">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-switch v-model="scope.row.isRemove" @change="userSatteChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="角色">
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-tag v-if="scope.row.level==0">用户</el-tag>
            <el-tag v-else-if="scope.row.level==1" type="success">管理员</el-tag>
            <el-tag v-else type="warning">特殊管理员</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot="header" slot-scope="scope">
            <el-input v-model="search" size="mini" clearable placeholder="输入标题关键字搜索" />
          </template>
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeUserById(scope.row.id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryModel.pageIndex"
        :page-sizes="[2,4,8,10]"
        :page-size="queryModel.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <!-- 修改用户 -->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisable"
        width="50%"
        @close="editDialogClosed"
      >
        <!-- 内容主体区域 -->
        <el-form ref="editFormRef" label-width="70px" :model="editForm" :rules="editFormRules">
          <el-form-item label="用户名">
            <el-input v-model="editForm.name" disabled></el-input>
          </el-form-item>

          <el-form-item label="性别">
            <el-radio v-model="editForm.sex" label="0" border>男</el-radio>
            <el-radio v-model="editForm.sex" label="1" border>女</el-radio>
          </el-form-item>
          <el-form-item label="生日">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="editForm.birthday"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email" clearable></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="phone">
            <el-input v-model="editForm.phone" clearable></el-input>
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="editForm.adress" clearable></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisable = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  nameValid,
  passwordValid,
  emailValid,
  mobileValid,
} from '../../common.js'

export default {
  data() {
    return {
      url: 'http://localhost:8510/',

      //封装一下需要查询的字符串

      queryModel: {
        isPage: true,
        pageIndex: 1,
        pageSize: 2,
      },
      total: 0,
      userList: [],

      addDialogVisable: false,
      addForm: {
        password: '',
        email: '',
        mobile: '',
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: nameValid,
        password: passwordValid,
        email: emailValid,
        mobile: mobileValid,
      },

      //修改用户信息
      editDialogVisable: false,
      editForm: {},
      editFormRules: {
        email: emailValid,
        mobile: mobileValid,
      },
      search: '',
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    //初始化数据
    async getUserList() {
      const { data: res } = await this.$http.get('User/GetAll', {
        params: this.queryModel,
      })
      if (res.code !== 200) return this.$message.error('获取用户列表失败')
      this.userList = res.data.data
      this.total = res.data.dataCount
      console.log(res)
    },
    //分页
    handleSizeChange(newSize) {
      this.queryModel.pageSize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      this.queryModel.pageIndex = newPage
      this.getUserList()
    },
    //更新用户状态
    async userSatteChange(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (res.code !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    //添加用户
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    addUser() {
      this.$refs.addFormRef.validate(async (validate) => {
        if (!validate) return
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.code !== 201) return this.$message.error('添加用户失败')
        this.$message.success('成功添加用户')
        this.addDialogVisable = false
        this.getUserList()
      })
    },
    //修改用户
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(`User/GetOneById?userId=` + id)
      if (res.code !== 200) return this.$message.error('获取用户信息失败')
      this.editForm = res.data
      this.editDialogVisable = true
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    editUserInfo() {
      this.$refs.editFormRef.validate(async (validate) => {
        if (!validate) return
        const { data: res } = await this.$http.put('User/Update', this.editForm)
        if (res.code !== 200) return this.$message.error('更新用户信息失败')
        this.editDialogVisable = false
        this.getUserList()
        this.$message.success('更新用户信息成功')
      })
    },

    //删除用户
    async removeUserById(id) {
      const confirmResult = await this.$confirm(
        '此操作将删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete(`users/` + id)
      if (res.code !== 200) return this.$message.errot('删除用户失败')
      this.$message.success('成功删除用户')
      this.getUserList()
    },

    // 监听分配角色对话框关闭事件
    setRoleDialogClosed() {
      this.selectedRoleId = ''
      this.userinfo = {}
    },

    getImg(imgUrl) {
      return this.url + imgUrl
    },
  
  },
}
</script>
<style  scoped>
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>