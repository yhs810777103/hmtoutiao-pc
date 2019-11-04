import axios from 'axios'
import local from '@/utils/local.js'
import router from '@/router/index.js'
import JSONBIG from 'json-bigint'
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
// 转换数据
axios.defaults.transformResponse = [(data) => {
  try {
    return JSONBIG.parse(data)
  } catch (e) {
    return data
  }
}]

// 设置默认请求头
// if (local.getUser()) {
//   axios.defaults.headers.Authorization = `Bearer ${local.getUser().token}`
// }

// 请求拦截器
// 登录成功,跳转页面,重新发请求时,请求头没有token,这时需要在每一次请求前的时候，获取token，设置token
axios.interceptors.request.use(config => {
  // 拦截成功往请求头中添加token
  const user = local.getUser() || {}
  config.headers.Authorization = `Bearer ${user.token}`
  return config
}, (error) => {
  // 做一些有请求错误的事情
  return Promise.reject(error)
})

// 响应拦截器
// token是有时效的,如果传一个失效的token给服务器,会报401错误,这时需要重新回登录页面重新获取有效的token
axios.interceptors.response.use(response => {
  // 使用响应数据返回响应；
  return response
}, error => {
  // 判断当状态码为401时,则要重新回登录页面重新获取有效token
  if (error.response.status === 401) {
    return router.push('/login')
  }
  // 使用响应错误返回
  return Promise.reject(error)
})

export default axios
