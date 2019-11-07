<template>
  <el-container class="container-home">
    <el-aside :width="isSwitch?'200px':'64px'">
      <span class="logo" :class="{smallLogo:!isSwitch}"></span>
      <el-menu
        :default-active="$route.path"
        background-color="#002033"
        text-color="#fff"
        active-text-color="#ffd04b"
        style="border-right:none"
        :collapse="!isSwitch"
        :collapse-transition="false"
        router
      >
        <el-menu-item index="/">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-menu-item index="/article">
          <i class="el-icon-document"></i>
          <span slot="title">内容管理</span>
        </el-menu-item>
        <el-menu-item index="/image">
          <i class="el-icon-picture"></i>
          <span slot="title">素材管理</span>
        </el-menu-item>
        <el-menu-item index="/publish">
          <i class="el-icon-s-promotion"></i>
          <span slot="title">发布文章</span>
        </el-menu-item>
        <el-menu-item index="/comment">
          <i class="el-icon-chat-dot-round"></i>
          <span slot="title">评论管理</span>
        </el-menu-item>
        <el-menu-item index="/fans">
          <i class="el-icon-present"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>
        <el-menu-item index="/setting">
          <i class="el-icon-setting"></i>
          <span slot="title">个人设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <span class="el-icon-s-fold icon" @click="switchNav"></span>
        <span class="title">江苏传智播客科技教育有限公司</span>
        <el-dropdown @command="userClick">
          <span class="el-dropdown-link">
            <!-- 下拉菜单 -->
            <img :src="userInfo.photo" alt />
            <span class="userName">{{userInfo.name}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-setting" command="setting">个人设置</el-dropdown-item>
            <el-dropdown-item icon="el-icon-unlock" command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main>
        <!-- <img src="../../assets/welcome.jpg" alt /> -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import eventBus from '@/views/eventBus.js'
import local from '@/utils/local.js'
export default {
  data () {
    return {
      isSwitch: true,
      userInfo: {
        name: null,
        photo: null
      }
    }
  },
  methods: {
    switchNav () {
      this.isSwitch = !this.isSwitch
    },
    setting () {
      this.$router.push('/setting')
    },
    logout () {
      local.removeUser()
      this.$router.push('/login')
    },
    // 给组件注册事件,事件并没有执行,说明不支持绑定事件,这就需要把事件绑定在解析的原生dom上
    // 可以通过事件修饰符native把事件绑定在原生dom上,  @click.native='方法名'
    // 也可以通过element-ui提供的方式command点击菜单项触发的回调
    userClick (command) {
      this[command]()
    }
  },
  created () {
    const user = local.getUser()
    // console.log(user)
    this.userInfo.name = user.name
    this.userInfo.photo = user.photo
    // 非父子传值 绑定自定义事件,事件对应的函数可以接收数据
    eventBus.$on('updateName', (name) => {
      this.userInfo.name = name // 个人设置里保存修改的名字后重新赋值给头部的用户名
    })
    eventBus.$on('togglePhoto', (photo) => {
      this.userInfo.photo = photo// 个人设置里保存修改的图片后重新赋值给头部的用户头像
    })
  }
}
</script>

<style scoped lang='less'>
.container-home {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  .el-aside {
    background: #002033;
    .logo {
      display: block;
      width: 100%;
      height: 60px;
      background: #002244 url("../../assets/logo_admin.png") no-repeat center /
        140px auto;
    }
    .smallLogo {
      background: url("../../assets/logo_admin_01.png") no-repeat center;
      background-size: 36px auto;
    }
  }
  .el-header {
    border-bottom: 1px solid #ddd;
    line-height: 60px;
    .icon {
      font-size: 30px;
      vertical-align: middle;
      margin-right: 10px;
    }
    .title {
      vertical-align: middle;
    }
    .el-dropdown {
      float: right;
      img {
        width: 30px;
        height: 30px;
        vertical-align: middle;
        margin-right: 5px;
      }
      .userName {
        font-weight: bold;
        vertical-align: middle;
      }
    }
  }
}
</style>
