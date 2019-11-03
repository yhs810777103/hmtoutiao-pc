<template>
  <!-- select选择器 -->
  <!-- clearable属性  是否清空选项 -->
  <el-select @input="fun" :value="value" placeholder="请选择" clearable>
    <el-option v-for="item in optionList" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
export default {
  props: ['value'],
  data () {
    return {
      // value: null,
      // 频道选项数据
      optionList: []
    }
  },
  created () {
    this.getOptionList()
  },
  methods: {
    // 发请求获取文章频道列表
    async getOptionList () {
      const { data: { data } } = await this.$axios.get('channels')
      // console.log({ data: { data } })
      this.optionList = data.channels
    },
    // 自定义事件函数(子传父)
    fun (channelsId) {
      if (channelsId === '') { channelsId = null }
      this.$emit('input', channelsId)
    }
  }
}
</script>

<style scoped lang='less'></style>
