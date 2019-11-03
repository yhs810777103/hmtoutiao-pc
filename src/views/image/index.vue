<template>
  <div class="container-image">
    <!-- 卡片组件 -->
    <el-card>
      <!-- 面包屑组件 -->
      <div slot="header">
        <my-bread>素材管理</my-bread>
      </div>
      <div>
        <!-- 单选框组件 -->
        <el-radio-group v-model="reqParams.collect" size="small" @change="toggleList">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <!-- 按钮组件 -->
        <el-button @click="dialogVisible=true" type="success" size="small" style="float:right">添加素材</el-button>
      </div>
      <div class="imgList">
        <div class="img" v-for="item in images" :key="item.id">
          <img :src="item.url" />
          <!-- v-if功能:当点击收藏按钮的时候隐藏图标,根据collect的值判断(取反) -->
          <div class="icon" v-if="!reqParams.collect">
            <!-- 当图片是收藏状态时,图标要显示红色(red是style中定义的类样式),根据后台返回的is_collected的值判断 -->
            <span
              :class="{red:item.is_collected}"
              @click="collection(item)"
              class="el-icon-star-off"
            ></span>
            <span @click="delImage(item.id)" class="el-icon-delete"></span>
          </div>
        </div>
      </div>
      <!-- page-size每页显示条目个数 -->
      <!-- current-page当前页数 -->
      <!-- current-change点击分页触发的事件 -->
      <!-- total 分页的总页数 -->
      <!-- 分页组件 -->
      <el-pagination
        @current-change="togglePage"
        :current-page="reqParams.page"
        :page-size="reqParams.per_page"
        background
        layout="prev, pager, next"
        :total="total"
      ></el-pagination>
      <!-- 对话框组件 -->
      <el-dialog title="添加素材" :visible.sync="dialogVisible" width="30%">
        <!-- 上传组件 -->
        <!-- name 上传的文件字段名(和接口参数要一致) -->
        <!-- show-file-list 是否显示已上传文件列表 -->
        <!-- headers 设置上传的请求头部 -->
        <!-- on-success 文件上传成功时的回调 -->
        <el-upload
          class="avatar-uploader"
          action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :headers="headers"
          name="image"
        >
          <!-- 上传成功后的预览图 -->
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <!-- 未上传时显示的图标(+) -->
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import local from '@/utils/local.js'
export default {
  data () {
    return {
      reqParams: {
        collect: false, // 是否收藏图片
        page: 1, // 分页第几页
        per_page: 10// 每页显示的数据
      },
      total: 0, // 分页总页数
      images: [], // 图片数据
      imageUrl: null, // 图片上传成功后的地址
      dialogVisible: false, // 对话框的显示与隐藏状态
      // 添加素材必须携带请求头,设置token
      headers: { Authorization: `Bearer ${local.getUser().token}` }
    }
  },
  created () {
    this.getImages()
  },
  methods: {
    // 获取图片列表
    async getImages () {
      const { data: { data } } = await this.$axios.get('user/images', { params: this.reqParams })
      this.images = data.results // 后台返回的图片数据
      this.total = data.total_count // 后台返回的分页总共的页数
    },
    // 点击分页触发的函数
    togglePage (newPage) {
      this.reqParams.page = newPage // 点击分页需要重新赋值
      this.getImages()
    },
    // 点击全部或收藏按钮触发的事件函数
    toggleList () {
      this.reqParams.page = 1 // 切换后分页要回到第一页
      this.getImages()
    },
    // 发请求添加收藏或取消收藏
    async collection (item) {
      // console.log(item)
      const { data: { data } } = await this.$axios.put(`user/images/${item.id}`, { collect: !item.is_collected })
      // console.log(data)
      item.is_collected = data.collect // 给图片现在的状态重新赋值
      this.$message.success((data.collect ? '添加收藏' : '取消收藏') + '成功')
    },
    // 发请求删除图片
    delImage (id) {
      this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$axios.delete(`user/images/${id}`)
        this.$message.success('图片删除成功')
        this.getImages()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 文件上传成功时的钩子函数
    handleAvatarSuccess (res, file) {
      // console.log(res)
      this.imageUrl = res.data.url
      window.setTimeout(() => {
        this.$message.success('图片添加成功')
        this.dialogVisible = false
        this.getImages()
        this.imageUrl = null
      }, 1000)
    }
  }
}
</script>

<style scoped lang='less'>
.imgList {
  margin-top: 20px;
  .img {
    width: 200px;
    height: 200px;
    border: 1px dashed #ccc;
    position: relative;
    margin: 0 50px 30px;
    display: inline-block;
    img {
      width: 100%;
      height: 100%;
    }
    .icon {
      display: block;
      width: 100%;
      height: 30px;
      line-height: 30px;
      position: absolute;
      left: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
      color: #fff;
      text-align: center;
      span {
        margin: 0 20px;
        &.red {
          color: red;
        }
      }
    }
  }
}
</style>
