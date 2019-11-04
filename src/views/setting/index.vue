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
              <el-form-item label="编号 :">1</el-form-item>
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
                <el-button type="primary">保存设置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-light">
            <el-upload
              class="avatar-uploader"
              action="http://ttapi.research.itcast.cn/mp/v1_0/user/profile"
              :show-file-list="false"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
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
export default {
  data () {
    return {
      userInfo: {
        name: null, // 用户名
        photo: null, // 用户头像
        email: null, // 用户邮箱
        mobile: null, // 手机号
        intro: null// 头条号简介
      },
      imageUrl: null
    }
  },
  async created () {
    const { data: { data } } = await this.$axios.get('user/profile')
    this.userInfo = data
    this.imageUrl = data.photo
  }
}
</script>

<style scoped lang='less'></style>
