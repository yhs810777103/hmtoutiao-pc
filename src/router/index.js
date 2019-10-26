import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login/index.vue'
import Home from '@/views/home'
import welcomeHome from '@/views/welcomehome'
import notFound from '@/views/404'
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
      path: '',
      component: welcomeHome
    }, {
      path: '*',
      component: notFound
    }]

  }
  ]
})
export default router
