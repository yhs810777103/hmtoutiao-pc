import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login/index.vue'
import Home from '@/views/home'
import welcomeHome from '@/views/welcomehome'
import notFound from '@/views/404'
import local from '@/utils/local'
import Article from '@/views/article'
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
