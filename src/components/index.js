// 插件的封装
import myBread from '@/components/my-bread.vue'
export default {
  install (Vue) {
    Vue.component('my-bread', myBread)
  }
}
