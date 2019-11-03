import Vue from 'vue'
import App from './App.vue'

import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import router from '@/router'
import axios from '@/api'

import '@/styles/index.less'

// 全局使用vue插件的封装
import VuePlugin from '@/components/index.js'
Vue.use(VuePlugin)

Vue.use(ElementUi)

Vue.prototype.$axios = axios

Vue.config.productionTip = false

new Vue({
  router: router,
  render: h => h(App)
}).$mount('#app')
