<template>
  <div class="container-welcome">
    <img src="../../assets/welcome.jpg" alt />
  </div>
</template>

<script>
export default {
  async created () {
    // this.$axios.get('http://ttapi.research.itcast.cn/mp/v1_0/articles').then(res => {
    //   console.log(res.data)
    // }).catch(() => {
    //   console.log('error')
    // })
    const a = await this.$axios.get('http://ttapi.research.itcast.cn/mp/v1_0/articles')
    console.log(a.data)
  }
}
</script>

<style scoped lang='less'>
img {
  display: block;
  margin: 0 auto;
}
</style>
