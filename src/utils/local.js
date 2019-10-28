// 存储用户信息的工具
// 先定义一个公用的key
const KEY = 'user - key'
const local = {
  setUser (user) {
    window.sessionStorage.setItem(KEY, JSON.stringify(user))
  },
  getUser () {
    return JSON.parse(window.sessionStorage.getItem(KEY))
  },
  removeUser () {
    window.sessionStorage.removeItem(KEY)
  }
}
export default local
