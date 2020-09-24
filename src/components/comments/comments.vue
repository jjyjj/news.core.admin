<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>评论管理</el-breadcrumb-item>
      <el-breadcrumb-item>评论列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <div class="tag-group">
        <el-tag
          style="margin:0 10px 10px 0"
          v-for="(user,index) in usersList"
          :key="index"
          effect="plain"
          @click="queryComments(user.id)"
        >{{ user.name }}</el-tag>
      </div>

      <!-- 个人评论区域 -->
      <el-dialog title="评论" :visible.sync="commentDialogVisible" width="70%">
        <el-card class="box-card" shadow="never">
          <div class="commentDiv">
            <!-- 评论列表区域 -->
            <el-card
              style="margin:5px 0 5px 0"
              class="box-card"
              shadow="never"
              v-for="item in this.commentsList"
              :key="item.id"
            >
              <div>
                <div id="comments">
                  <ol class="comments-list">
                    <li class="comment">
                      <div>
                        <img
                          :src="getImg(item.comments[0].user.imgUrl)"
                          alt="Avatar"
                          class="avatar"
                        />

                        <div class="comment-meta">
                          <span class="author">
                            <span>{{item.comments[0].userName}}</span>
                          </span>
                          <span class="date">
                            <span>{{item.comments[0].createTime}}</span>
                          </span>
                          <span class="reply">
                            <span
                              @click="openAddComment(2,item.comments[0].userName,item.comments[0].id) ,ss(item.comments[0].id)"
                            >
                              <el-tooltip
                                class="item"
                                effect="dark"
                                content="查看评论文章"
                                placement="top"
                              >
                                <el-button
                                  type="primary"
                                  @click="goDetials(item.news.id)"
                                  icon="el-icon-view"
                                  circle
                                ></el-button>
                              </el-tooltip>
                              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                <el-button type="danger" icon="el-icon-delete" circle></el-button>
                              </el-tooltip>
                            </span>
                          </span>
                        </div>
                        <div class="comment-body">
                          <div v-html="item.comments[0].content">{{}}</div>
                        </div>
                        <div class="sss">
                          <el-tooltip
                            v-if="!isShow&& item.commentsChildren.length>0"
                            class="item"
                            effect="dark"
                            content="展开"
                            placement="top"
                          >
                            <i class="el-icon-caret-bottom more" @click="isShow=true"></i>
                          </el-tooltip>
                        </div>
                      </div>

                      <ul class="children" v-if="isShow">
                        <el-divider v-if="item.commentsChildren.length>0">子评论</el-divider>
                        <li class="comment" v-for="items in item.commentsChildren" :key="items.id">
                          <div>
                            <img :src="getImg(items.user.imgUrl)" alt="Avatar" class="avatar" />
                            <div class="comment-meta">
                              <span class="author">
                                <span>{{items.user.name}} @ {{items.userName}}</span>
                              </span>
                              <span class="date">
                                <span>{{items.createTime}}</span>
                              </span>
                              <span class="reply">
                                <span
                                  @click="openAddComment(2,items.user.name,item.comments[0].id,items.id)"
                                >
                                  <el-tooltip
                                    class="item"
                                    effect="dark"
                                    content="删除"
                                    placement="top"
                                  >
                                    <el-button type="danger" icon="el-icon-delete" circle></el-button>
                                  </el-tooltip>
                                </span>
                              </span>
                            </div>
                            <!-- .comment-meta -->

                            <div class="comment-body" v-html="items.content"></div>

                            <!-- .comment-body -->
                          </div>
                        </li>
                      </ul>
                      <div class="sss">
                        <el-tooltip
                          v-if="isShow&& item.commentsChildren.length>0"
                          class="item"
                          effect="dark"
                          content="收起"
                          placement="top"
                        >
                          <i class="el-icon-caret-top more" @click="isShow=false"></i>
                        </el-tooltip>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>
            </el-card>
          </div>

          <!-- 分页区域 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryModel.pageIndex"
            :page-sizes="[1, 2, 4]"
            :page-size="queryModel.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </el-card>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
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
      commentDialogVisible: false,
      //查询条件
      queryModel: {
        isPage: false,
        pageIndex: 1,
        pageSize: 2,
      },
      total: 0,
      uid: 0,
      url: 'http://localhost:8510/',
      commentsList: [],
      usersList: [],
      defaultProps: {
        children: 'commentsChildren',
        label: 'label',
      },
      isShow: false,
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('User/GetAll', {
        params: this.queryModel,
      })
      if (res.code !== 200) return this.$message.error('获取用户列表失败')
      this.usersList = res.data
    },

    //初始化数据
    async getCommentsListByUserId(userId) {
      this.queryModel.isPage = true
      const { data: res } = await this.$http.get(
        `Comment/GetAllByUserId?userId=${userId}`,
        {
          params: this.queryModel,
        }
      )
      if (res.code !== 200) return this.$message.error('获取图片列表失败')
      this.commentsList = res.data.data
      this.total = res.data.dataCount
      console.log(this.commentsList)
    },
    //评论分页
    handleSizeChange(newSize) {
      this.queryModel.pageSize = newSize

      this.getCommentsListByUserId(this.uid)
    },
    handleCurrentChange(newPage) {
      this.queryModel.pageIndex = newPage
      this.getCommentsListByUserId(this.uid)
    },
    queryComments(userId) {
      this.commentDialogVisible = true
      this.uid = userId
      this.getCommentsListByUserId(userId)
    },
    getImg(imgUrl) {
      return this.url + imgUrl
    },
    goDetials(newsId) {
      window.open(`http://localhost:8081/#/NewsDetails?newsId=${newsId}`)
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

#comments {
  font-size: 13px;
  font-size: 0.8125rem;
}
#comments .comments-title {
  margin: 0 0 5px 0;
}
#comments .leave-comment {
  display: block;
  margin: 0 0 40px 0;
}
#comments ul,
#comments ol {
  margin: 0;
  padding: 0;
  margin-top: 5px;
}
#comments .comment {
  margin: 0;
  padding: 0;
  list-style: none;
  clear: both;
}
#comments .comments-title {
  text-shadow: none;
  margin-bottom: 0;
}
.avatar {
  float: left;
  width: 40px;
  height: 40px;

  -webkit-border-radius: 50%;
  -webkit-background-clip: padding-box;
  -moz-border-radius: 50%;
  -moz-background-clip: padding;
  border-radius: 50%;
  background-clip: padding-box;
}
#comments .children {
  margin: 0 0 0 90px;
}
#comments .comment-meta {
  margin: 0 0 0 90px;
}
#comments .comment-meta a {
  color: #333333;
}
#comments .comment-meta a:hover {
  color: #bd1550;
}
#comments .comment-meta .author {
  margin: 0 20px 0 0;
  font-weight: bold;
}
#comments .comment-meta .date {
  margin: 0 20px 0 0;
  color: #b3b3b3;
}
#comments .comment-meta .date a {
  color: #666666;
}
#comments .comment-meta .reply {
  float: right;
}
#comments .comment-body {
  margin: 10px 0 35px 90px;
}
.comment-navigation {
  width: 100%;
  border-top: 1px solid #ccc;
  padding: 2px 0 0 0;
}
.comment-navigation .nav-content {
  border-top: 1px solid #ccc;
  width: 100%;
  padding: 10px 0 0 0;
}
.comment-navigation .nav-previous {
  float: left;
  width: 50%;
}
.comment-navigation .nav-next {
  float: right;
  width: 50%;
  text-align: right;
}
#respond {
  margin: 55px 0 0 0;
}

.sss {
  width: 2%;
  margin: auto;
}
.el-divider--horizontal {
  width: 90%;
}
.more {
  font-size: 20px;
  cursor: pointer;
}
</style>