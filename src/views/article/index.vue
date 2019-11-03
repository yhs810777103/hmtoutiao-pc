<template>
  <div class="container-article">
    <!-- 卡片 -->
    <el-card>
      <div slot="header">
        <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>-->
        <my-bread>内容管理</my-bread>
      </div>
      <!-- 表单 -->
      <el-form label-width="80px" size="small">
        <el-form-item label="状态:">
          <!-- 单选框 -->
          <el-radio-group v-model="reqParams.status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道:">
          <!-- 频道的视图 -->
          <!-- 父组件收到数据后 自动把数据赋值 reqParams.channel_id  （自动完成） -->
          <my-channel v-model="reqParams.channel_id"></my-channel>
          <!-- <el-select v-model="reqParams.channel_id" placeholder="请选择" clearable>
            <el-option
              v-for="item in optionList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>-->
        </el-form-item>
        <el-form-item label="日期:">
          <!-- 日期选择器 -->
          <el-date-picker
            v-model="dateArr"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeDate"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native="clickScreen(dateArr)">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top:20px">
      <div slot="header">
        <span>根据筛选条件共查询到 {{total}} 条结果</span>
      </div>
      <template>
        <!-- 当el-table元素中注入data对象数组后，在el-table-column中用prop属性来对应对象中的键名即可填入数据 -->
        <el-table :data="articleList">
          <el-table-column label="封面">
            <template slot-scope="scope">
              <el-image
                :src="scope.row.cover.images[0]"
                fit="fill"
                style="width:150px;height:100px"
              >
                <div slot="error">
                  <img src="../../assets/error.gif" width="150" height="100" />
                </div>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="标题" prop="title"></el-table-column>
          <el-table-column label="状态" prop="status">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status===0" type="info">草稿</el-tag>
              <el-tag v-if="scope.row.status===1">待审核</el-tag>
              <el-tag v-if="scope.row.status===2" type="success">审核通过</el-tag>
              <el-tag v-if="scope.row.status===3" type="warning">审核失败</el-tag>
              <el-tag v-if="scope.row.status===4" type="danger">已删除</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="发布时间" prop="pubdate"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- 编辑按钮 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                plain
                @click="editArticle(scope.row.id)"
              ></el-button>
              <!-- 删除按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                plain
                @click="delArticle(scope.row.id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        :total="total"
        @current-change="switchPage"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
// import axios from 'axios'
export default {
  data () {
    return {
      // 筛选的一些参数
      reqParams: {
        status: null, // 文章状态
        channel_id: null, // 频道id
        begin_pubdate: null, // 开始日期
        end_pubdate: null, // 结束日期
        page: 1, // 当前页数
        per_page: 20 // 默认每一页显示20条
      },
      // 频道选项数据
      // optionList: [],
      // 日期数组
      dateArr: [],
      // 文章数据
      articleList: [],
      total: 0
    }
  },
  created () {
    // 获取文章 频道 列表
    this.getOptionList()
    // 获取所有文章
    this.getArticles()
  },
  methods: {
    // 筛选按钮事件
    clickScreen () {
      // 当清空频道选项时,值要重新赋值为null
      if (this.reqParams.channel_id === '') {
        this.reqParams.channel_id = null
      }
      // 筛选事件触发后分页要回到第一页
      this.reqParams.page = 1
      this.getArticles()
    },
    // 确认选定的日期值时触发的事件
    changeDate (dateArr) {
      if (dateArr) {
        this.reqParams.begin_pubdate = dateArr[0]
        this.reqParams.end_pubdate = dateArr[1]
      } else {
        // 清除选择的日期后  dateArr的值要设为 null
        this.reqParams.begin_pubdate = null
        this.reqParams.end_pubdate = null
      }
    },
    // 发请求获取文章频道列表
    async getOptionList () {
      const { data: { data } } = await this.$axios.get('channels')
      // console.log({ data: { data } })
      this.optionList = data.channels
    },
    // 发请求获取文章列表
    async getArticles () {
      const { data: { data } } = await this.$axios.get('articles', { params: this.reqParams })
      // console.log({ data: { data } })
      this.articleList = data.results
      // 文章的总条数
      this.total = data.total_count
    },
    // 切换分页(会自己携带参数)
    switchPage (newPage) {
      // 当前页数改为点击的页数实现切换
      this.reqParams.page = newPage
      this.getArticles()
    },
    // 编辑文章
    editArticle (id) {
      // console.log(id)
      // 跳转路由需要携带参数id
      this.$router.push({ path: '/publish', query: { id: id } })
    },
    // 删除文章(id值过大,js处理时会有误差,)
    async delArticle (id) {
      console.log(id)
      await this.$axios.delete(`articles/${id}`)
      this.$message.success('删除文章成功')
      this.getArticles()
    }
  }
}
</script>

<style scoped lang='less'>
</style>
