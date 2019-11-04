<template>
  <div class="my-image">
    <div class="image-btn" @click="open">
      <img :src="value || imageBtn" alt />
    </div>
    <!-- 对话框组件 -->
    <el-dialog :visible.sync="dialogVisible" width="750">
      <!-- 标签页组件 -->
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="image">
          <!-- 单选框组件 -->
          <el-radio-group @change="toggleList" v-model="reqParams.collect" size="small">
            <el-radio-button :label="false">全部</el-radio-button>
            <el-radio-button :label="true">收藏</el-radio-button>
          </el-radio-group>
          <!-- 素材库中的图片列表 -->
          <div class="imageList">
            <div
              class="img"
              :class="{selected:selectedImageUrl===item.url}"
              v-for="item in images"
              :key="item.id"
              @click="selectedImage(item.url)"
            >
              <img :src="item.url" alt />
            </div>
          </div>
          <!-- 分页组件 -->
          <el-pagination
            @current-change="togglePage"
            background
            layout="prev, pager, next"
            :total="total"
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="uploadImage">
          <!-- 上传组件 -->
          <el-upload
            class="avatar-uploader"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :headers="headers"
            name="image"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmImage">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import local from '@/utils/local.js'
// 动态绑定的资源不会被打包,需要单独引入(网络地址，不需要这个做法)
import btnImage from '../assets/default.png'
export default {
  props: ['value'], // 接收父组件的传值
  data () {
    return {
      dialogVisible: false, // 对话框的显示与隐藏状态
      activeName: 'image', // 当前选中的按钮
      reqParams: {
        collect: false, // 是否收藏图片
        page: 1, // 分页第几页
        per_page: 10// 每页显示的数据
      },
      images: [], // 图片列表
      total: 0, // 分页的总数
      selectedImageUrl: null, // 选中素材库图片的地址
      imageUrl: null, // 上传图片的地址
      imageBtn: btnImage,
      headers: { Authorization: `Bearer ${local.getUser().token}` }// 添加请求图,携带token
    }
  },
  methods: {
    // 对话框按钮的点击事件函数
    confirmImage () {
      if (this.activeName === 'image') {
        // 如果没有选择图片给提示
        if (!this.selectedImageUrl) {
          return this.$message.warning('请选择图片')
        }
        // 把选中素材库图片的路径赋值给图片按钮显示
        // this.imageBtn = this.selectedImageUrl
        this.$emit('input', this.selectedImageUrl)// 把值传给父组件达到双向绑定
        this.dialogVisible = false// 隐藏图片
      } else {
        // 如果没有上传图片给提示
        if (!this.imageUrl) {
          return this.$message.warning('请上传图片')
        }
        // 把上传图片的路径赋值给图片按钮显示
        // this.imageBtn = this.imageUrl
        this.$emit('input', this.imageUrl)// 把值传给父组件达到双向绑定
        this.dialogVisible = false
      }
    },
    // 图片按钮的事件
    open () {
      this.dialogVisible = true
      this.getImages()
    },
    // 对话框中获取图片列表
    async getImages () {
      const { data: { data } } = await this.$axios.get('user/images', { params: this.reqParams })
      this.images = data.results // 后台返回的图片数据
      this.total = data.total_count // 后台返回的分页总共的页数
    },
    // 对话框中点击分页触发的函数
    togglePage (newPage) {
      this.reqParams.page = newPage
      this.getImages()
    },
    // 对话框中点击全部或收藏按钮触发的事件函数
    toggleList () {
      this.reqParams.page = 1
      this.getImages()
    },
    // 点击图片获取图片地址
    selectedImage (url) {
      console.log(url)
      this.selectedImageUrl = url
    },
    // 文件上传成功时的函数(自动携带参数response,file, fileList)
    handleAvatarSuccess (res) {
      this.imageUrl = res.data.url
      this.$message.success('图片上传成功')
    }
  }
}
</script>

<style scoped lang='less'>
//图片按钮的类样式
.image-btn {
  width: 150px;
  height: 150px;
  border: 1px dashed #ccc;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
// 取消和确定按钮的类样式
.dialog-footer {
  width: 100%;
  display: block;
  text-align: center;
}
//对话框中图片列表的类样式
.imageList {
  .img {
    width: 150px;
    height: 120px;
    display: inline-block;
    margin-right: 20px;
    margin-bottom: 20px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
    //当图片选中时添加的类样式(伪元素的形式)
    &.selected::after {
      content: "";
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3) url("../assets/selected.png") no-repeat
        center / 50px;
      position: absolute;
      left: 0;
      top: 0;
    }
  }
}
.avatar-uploader {
  text-align: center;
}
</style>
