<template>
  <div class="container">
    <!-- <img src="../assets/login_bg.jpg" alt /> -->
    <el-card>
      <img src="../../assets/logo_index.png" alt />
      <el-form ref="form" :model="logonFrom">
        <el-form-item>
          <el-input v-model="logonFrom.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="logonFrom.code"
            placeholder="请输入验证码"
            style="width:240px;margin-right:8px"
          ></el-input>
          <el-button>发送验证码</el-button>
        </el-form-item>
        <el-form-item>
          <el-checkbox :value="true">我已阅读并同意用户协议和隐私条款</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      logonFrom: {
        mobile: '',
        code: ''
      }
    }
  }
}
</script>

<style lang='less'>
.container {
  width: 100%;
  height: 100%;
  background: url("../../assets/login_bg.jpg") no-repeat center / cover;
  position: absolute;
  left: 0;
  top: 0;
}
.el-card {
  width: 400px;
  height: 340px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  img {
    width: 200px;
    display: block;
    margin: 0 auto 20px;
  }
}
</style>
