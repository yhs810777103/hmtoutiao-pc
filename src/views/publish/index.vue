<template>
  <div class="container-publish">
    <!-- 卡片组件 -->
    <el-card>
      <!-- 面包屑封装组件 -->
      <div slot="header">
        <!-- 当地址中携带了id则标题为修改文章,没有id则为发布文章 -->
        <my-bread>{{$route.query.id?'修改':'发布'}}文章</my-bread>
      </div>
      <!-- 表单组件 -->
      <el-form label-width="120px">
        <el-form-item label="标题:">
          <el-input style="width:25rem" v-model="articleFrom.title"></el-input>
        </el-form-item>
        <el-form-item label="内容:">
          <!-- 富文本框 -->
          <quill-editor v-model="articleFrom.content" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item label="封面:">
          <!-- 单选框组件 -->
          <el-radio-group v-model="articleFrom.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <!-- 封面图组件 -->
          <!-- 当为单图时显示一张封面图 -->
          <div v-if="articleFrom.cover.type===1">
            <my-image v-model="articleFrom.cover.images[0]"></my-image>
          </div>
          <!-- 当为3图时显示3张封面图 -->
          <div v-if="articleFrom.cover.type===3">
            <my-image v-for="item in 3" :key="item" v-model="articleFrom.cover.images[0]"></my-image>
          </div>
        </el-form-item>
        <el-form-item label="频道:">
          <my-channel v-model="articleFrom.channel_id"></my-channel>
        </el-form-item>
        <!-- 当地址中携带了id,则显示修改文章 -->
        <el-form-item v-if="$route.query.id">
          <el-button type="primary" @click="editArticle($route.query.id,false)">修改文章</el-button>
          <el-button @click="editArticle($route.query.id,true)">存入草稿</el-button>
        </el-form-item>
        <!-- 当地址中没有携带id,则显示发表文章 -->
        <el-form-item v-else>
          <el-button type="primary" @click="newArticle(false)">发表文章</el-button>
          <el-button @click="newArticle(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 引入富文本框及其样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
export default {
  components: { quillEditor }, // 富文本框
  data () {
    return {
      articleFrom: {
        title: null, // 文章标题
        content: null, // 文章标题
        cover: { type: 1, images: [] }, // 封面
        channel_id: null// 文章所属频道id
      },
      // 富文本框的工具
      editorOption: {
        placeholder: '',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            ['image']
          ]
        }
      }
    }
  },
  created () {
    this.articleStatus()
  },
  // 当从编辑文章 点击到发布文章时,这时地址中已经也不再携带id,但组件并没有初始化,重置表单(内容没有被清空)
  // 当路由规则没有发生改变的时候，组件是不会重新初始化,只有组件初始化的时候才会只会执行一次。
  // watch选项可以做到监听地址栏中id的数据变化,可以实现有id时表单中有数据,无id时重置表单(内容清空)
  watch: {
    '$route.query.id': function () {
      this.articleStatus()
    }
  },
  methods: {
    // 文章发布或存入草稿的事件函数
    async newArticle (draft) {
      await this.$axios.post('articles?draft=' + draft, this.articleFrom)
      this.$message.success(draft ? '已存入草稿' : '文章发布成功')
      this.$router.push('/article')
    },
    // 获取指定文章
    async getArticle (id) {
      const { data: { data } } = await this.$axios.get('articles/' + id)
      this.articleFrom = data
    },
    // 修改文章或存入草稿的函数
    async editArticle (id, draft) {
      // 发请求需要加3个参数(header,query,body)
      await this.$axios.put(`articles/${id}?draft=${draft}`, this.articleFrom)
      this.$message.success('文章修改成功')
      this.$router.push('/article')
    },
    // 切换文章的状态是修改还是发布
    articleStatus () {
      // 获取文章的id(看地址栏的参数类型,如果是 ? 就用query,如果是 / 就用params)
      const articleId = this.$route.query.id
      // console.log(articleId)
      if (articleId) {
        this.getArticle(articleId)// 点击编辑按钮跳到发布文章页面 通过id获取文章信息
      } else {
        // 当没有携带id时,代表为发布界面,要清空里面的内容
        this.articleFrom = {
          title: null, // 文章标题
          content: null, // 文章标题
          cover: { type: 1, images: [] }, // 封面
          channel_id: null// 文章所属频道id
        }
      }
    }
  }
}
</script>

<style scoped lang='less'>
// 封面图为3组图时的样式
.my-image {
  display: inline-block;
  margin-right: 10px;
}
</style>
