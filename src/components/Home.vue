<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img class="avator" src="../assets/logo.png" alt />
        <span>博客交流管理后台系统</span>
      </div>
      <el-button type="info" @click="logout">登出</el-button>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="flag == true ? '64px' : '200px'">
        <div class="toggle-btn" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :collapse-transition="false"
          :unique-opened="true"
          :collapse="flag"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="`${item.id}`" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="`/${subItem.path}`"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState(`/${subItem.path}`)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体内容 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menuList: [
        {
          id: '101',
          path: '/users',
          authName: '用户管理',
          children: [{ id: '121', path: 'users', authName: '用户列表' }],
        },
        {
          id: '102',
          path: '/articles',
          authName: '文章管理',
          children: [
            { id: '112', path: 'articles', authName: '文章列表' },
            { id: '122', path: 'categories', authName: '文章分类' },
          ],
        },
        {
          id: '103',
          path: '/imgs',
          authName: '图片管理',
          children: [{ id: '113', path: 'imgs', authName: '图片列表' }],
        },
        {
          id: '104',
          path: '/comments',
          authName: '评论管理',
          children: [{ id: '114', path: 'comments', authName: '评论列表' }],
        },

        {
          id: '105',
          path: '/report',
          authName: '数据统计',
          children: [
            { id: '115', path: 'UsersReport', authName: '数据报表' },
          ],
        },
      ],
      iconsObj: {
        101: 'iconfont icon-user',
        102: 'el-icon-document',
        103: 'el-icon-picture',
        104: 'el-icon-chat-dot-round',
        105: 'iconfont icon-baobiao',
      },
      flag: false,
      activePath: '',
    }
  },
  created() {
    // this.getMenuList()
    if (this.$route.path !== '/welcome')
      this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      // 清除token
      window.sessionStorage.clear()
      // 页面跳转
      this.$router.push('login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    toggleCollapse() {
      this.flag = !this.flag
    },
    saveNavState(path) {
      window.sessionStorage.setItem('activePath', path)
      this.activePath = path
      this.$router.push(path)
    },
  },
}
</script>


<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  padding: 0;
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    > span {
      margin-left: 20px;
      font-weight: bold;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border: 0;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin: 10px;
}

.toggle-btn {
  line-height: 30px;
  color: #fff;
  background-color: #4a5064;
  text-align: center;
  cursor: pointer;
}

.avator {
  border-radius: 50%;
  height: 61px;
  width: 56px;
}
</style>
