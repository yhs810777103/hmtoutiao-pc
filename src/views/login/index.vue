<template>
  <div class="container">
    <!-- <img src="../assets/login_bg.jpg" alt /> -->
    <el-card>
      <img src="../../assets/logo_index.png" alt />
      <el-form ref="loginFrom" :model="loginFrom" :rules="loginRules" status-icon>
        <el-form-item prop="mobile">
          <el-input v-model="loginFrom.mobile" placeholder="请输入手机号" ref="myInput"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            v-model="loginFrom.code"
            placeholder="请输入验证码"
            style="width:240px;margin-right:8px"
          ></el-input>
          <el-button>发送验证码</el-button>
        </el-form-item>
        <el-form-item>
          <el-checkbox :value="true">我已阅读并同意用户协议和隐私条款</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%" @click="loginBtn(loginFrom)">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import local from '@/utils/local.js'
export default {
  data () {
    const checkMobile = (rule, value, callback) => {
      if (/^1[3-9]\d{9}$/.test(value)) {
        callback()
      } else {
        callback(new Error('手机号格式错误'))
      }
    }
    return {
      loginFrom: {
        mobile: '',
        code: ''
      },
      loginRules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '验证码为6个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 用promise方式发请求
    //   loginBtn (loginFrom) {
    //     this.$refs['loginFrom'].validate(valid => {
    //       if (valid) {
    //         // console.log('OK')
    //         this.$axios({
    //           url: 'authorizations',
    //           data: this.loginFrom,
    //           method: 'post'
    //         })
    //           .then(result => {
    //             // console.log(result)
    //             local.setUser(result.data.data)
    //             this.$router.push('/')
    //           })
    //           .catch(() => {
    //             this.$message.error('输入的手机号或验证码有误')
    //           })
    //       }
    //     })
    //   }

    // 运用async和await写请求
    loginBtn (loginFrom) {
      this.$refs['loginFrom'].validate(async valid => {
        if (valid) {
          try {
            const res = await this.$axios.post('authorizations', this.loginFrom)
            local.setUser(res.data.data)
            this.$router.push('/')
          } catch (e) { this.$message.error('输入的手机号或验证码有误') }
        }
      })
    }
  },
  mounted () {
    this.$refs.myInput.focus()
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
}
</style>
