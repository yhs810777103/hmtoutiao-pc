import Vue from 'vue'
import VueRouter from 'vue-router' // 路由
import login from '../views/login/index.vue' // 登录页面
import Home from '@/views/home' // 主页
import welcomeHome from '@/views/welcomehome' // 欢迎页面
import notFound from '@/views/404' // 404页面
import local from '@/utils/local' // 存储用户信息的工具
import Article from '@/views/article' // 内容管理
import Image from '@/views/image' // 素材管理
import Publish from '@/views/publish' // 发布文章
import Comment from '@/views/comment' // 评论管理
import Fans from '@/views/fans'
import Setting from '@/views/setting' // 个人设置
Vue.use(VueRouter)
const router = new VueRouter({
  routes: [{
    path: '/login',
    component: login
  },
  {
    path: '/',
    component: Home,
    children: [{
      path: '/',
      component: welcomeHome
    },
    {
      path: '/article',
      component: Article
    },
    {
      path: '/image',
      component: Image
    },
    {
      path: '/publish',
      component: Publish
    },
    {
      path: '/comment',
      component: Comment
    }, {
      path: '/fans',
      component: Fans
    },
    {
      path: '/setting',
      component: Setting
    }
    ]
  },
  {
    path: '*',
    component: notFound
  }
  ]
})
// 除去登录页面，其他页面访问的时候，都需要判断登录状态,如果没有登录就拦截在登录界面
// vue-router中提供的导航守卫功能
router.beforeEach((to, from, next) => {
  const user = local.getUser()
  if (user && user.token) {
    next()
  } else {
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  }
})
export default router
