<template>
  <div class="container-comment">
    <!-- 卡片组件 -->
    <el-card>
      <!-- 面包屑组件 -->
      <div slot="header">
        <my-bread>评论管理</my-bread>
      </div>
      <!-- 表格组件 -->
      <!-- data为显示的数据 -->
      <!-- 用prop属性来对应对象中的键名即可填入数据 -->
      <el-table :data="articles" style="width: 100%">
        <el-table-column label="标题" width="500px" prop="title"></el-table-column>
        <el-table-column label="总评论数" prop="total_comment_count"></el-table-column>
        <el-table-column label="粉丝评论数" prop="fans_comment_count"></el-table-column>
        <el-table-column label="状态">
          <!-- 插槽 -->
          <!-- 根据后台返回的状态选择关闭或正常 -->
          <template slot-scope="scope">{{scope.row.comment_status?'关闭':'正常'}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- 插槽 -->
          <template slot-scope="scope">
            <!-- 按钮组件 -->
            <el-button
              @click="toggleStatus(scope.row.id,false)"
              v-if="scope.row.comment_status"
              type="success"
              size="small"
            >打开评论</el-button>
            <el-button
              @click="toggleStatus(scope.row.id,true)"
              v-else
              type="danger"
              size="small"
            >关闭评论</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <!-- current-page  当前页数 -->
      <!-- page-size 每页显示条目个数 -->
      <!-- total  总页数 -->
      <el-pagination
        @current-change="togglePage"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      articles: [], // 文章列表
      reqParams: {
        response_type: 'comment', // 返回数据的字段,传comment 返回用于评论管理的字段
        page: 1, // 页数
        per_page: 20// 每页数量
      },
      total: 0// 分页总数
    }
  },
  created () {
    this.getArticle()
  },
  methods: {
    // 获取文章列表
    async getArticle () {
      const { data: { data } } = await this.$axios.get('articles', { params: this.reqParams })
      this.articles = data.results
      this.total = data.total_count
    },
    // 切换分页的函数
    togglePage (newPage) {
      this.reqParams.page = newPage
      this.getArticle()
    },
    // 切换打开评论或关闭评论是的函数(当点击打开评论按钮时 关闭状态要换成正常,点击关闭评论时 正常状态要改为关闭状态)
    toggleStatus (id, commentStatus) {
      // 弹框组件中的确认消息
      const hint1 = '您确认要打开该文章的评论功能吗？'
      const hint2 = '关闭评论功能后用户将无法对该文章进行评论，您确认要关闭该文章的评论功能吗？'
      this.$confirm(commentStatus ? hint2 : hint1, '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning' // 表明消息类型(警告)
      }).then(async () => {
        const { data: { data } } = await this.$axios.put(`comments/status?article_id=${id}`, { allow_comment: commentStatus })
        this.$message.success(data.allow_comment ? '打开评论成功' : '关闭评论成功')
        this.getArticle()
      }).catch(() => { })
    }
  }
}
</script>

<style scoped lang='less'>
</style>
