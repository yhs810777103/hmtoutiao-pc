<template>
  <div class="container-setting">
    <!-- 卡片组件 -->
    <el-card>
      <!-- 面包屑组件 -->
      <div slot="header">
        <my-bread>个人设置</my-bread>
      </div>
      <!-- 布局组件(栅格布局) -->
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <!-- 表单组件 -->
            <el-form label-width="120px">
              <el-form-item label="编号 :">{{userInfo.id}}</el-form-item>
              <el-form-item label="手机 :">{{userInfo.mobile}}</el-form-item>
              <el-form-item label="媒体名称 :">
                <el-input v-model="userInfo.name"></el-input>
              </el-form-item>
              <el-form-item label="媒体介绍 :">
                <el-input type="textarea" v-model="userInfo.intro"></el-input>
              </el-form-item>
              <el-form-item label="邮箱 :">
                <el-input v-model="userInfo.email"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUserInfo">保存设置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-light">
            <!-- 上传组件默认只支持post请求,而接口提供的patch请求,所以需要自定义上传 -->
            <!-- http-request属性 覆盖默认的上传行为，可以自定义上传的实现,默认会返回一个参数 -->
            <el-upload
              class="avatar-uploader"
              action
              :http-request="updatePhoto"
              :show-file-list="false"
            >
              <img v-if="userInfo.photo" :src="userInfo.photo" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <p style="text-align:center">修改头像</p>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import eventBus from '@/views/eventBus.js'
import local from '@/utils/local.js'
export default {
  data () {
    return {
      userInfo: {
        name: null, // 用户名
        photo: null, // 用户头像
        email: null, // 用户邮箱
        mobile: null, // 手机号
        intro: null// 头条号简介
      }
    }
  },

  created () {
    this.getUserInfo()
  },
  methods: {
    // 获取用户信息
    async getUserInfo () {
      const { data: { data } } = await this.$axios.get('user/profile')
      this.userInfo = data
    },
    // 点击保存设置是触发的事件函数
    async saveUserInfo () {
      // 发请求需要传递的参数(看接口文档)
      const { name, intro, email } = this.userInfo
      // 发请求编辑用户信息
      await this.$axios.patch('user/profile', { name, intro, email })
      this.$message.success('保存成功')
      // 非父子传值 触发自定义事件,同时提交修改后的数据(参数是传给头部的)
      eventBus.$emit('updateName', name)
      // 本地缓存也要变更修改后的值(分三步:先获取,再赋修改后值,再设置回去)
      const user = local.getUser()
      user.name = name
      local.setUser(user)
    },
    // 更新图片的自定义事件(有默认参数)
    async updatePhoto ({ file }) {
      // 通过formdata异步上传文件
      const formData = new FormData()
      // 通过append()方法来追加数据 photo为参数名称  file代表图片
      formData.append('photo', file)
      const { data: { data } } = await this.$axios.patch('user/photo', formData)
      this.$message.success('头像修改成功')
      this.userInfo.photo = data.photo// 将修改后的图片重新赋值
      // 非父子传值 触发自定义事件,同时提交修改后的数据(参数是传给头部的)
      eventBus.$emit('togglePhoto', data.photo)
      // 本地缓存也要变更修改后的值(分三步:先获取,再赋修改后值,再设置回去)
      const user = local.getUser()
      user.photo = data.photo
      local.setUser(user)
    }
  }
}
</script>

<style scoped lang='less'></style>
