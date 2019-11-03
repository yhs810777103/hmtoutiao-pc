// 插件的封装
// 面包屑的封装
import myBread from '@/components/my-bread.vue'
// 文章频道的封装
import myChannel from '@/components/my-channel.vue'
export default {
  install (Vue) {
    Vue.component('my-bread', myBread)
    Vue.component('my-channel', myChannel)
  }
}
