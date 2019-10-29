<template>
  <div class="container-article">
    <!-- 卡片 -->
    <el-card class="container-article">
      <div slot="header">
        <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>-->
        <my-bread>内容管理</my-bread>
      </div>
      <!-- 表单 -->
      <el-form label-width="80px" size="small">
        <el-form-item label="状态:">
          <!-- 单选框 -->
          <el-radio-group v-model="reqParams.status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道:">
          <!-- select选择器 -->
          <el-select v-model="reqParams.option_id" placeholder="请选择">
            <el-option
              v-for="item in optionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期:">
          <!-- 日期选择器 -->
          <el-date-picker
            v-model="dateArr"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native="clickScreen(dateArr)">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// import axios from 'axios'
export default {
  data () {
    return {
      // 筛选的一些参数
      reqParams: {
        status: null,
        option_id: null,
        begin_pubdate: null,
        end_pubdate: null
      },
      // 频道选项数据
      optionList: [{ value: 1, label: 'java' }, { value: 2, label: '前端' }],
      // 日期数组
      dateArr: []
    }
  }
  // methods: {
  //   clickScreen (dateArr) {
  //     // console.log(dateArr)
  //     this.reqParams.begin_pubdate = dateArr[0]
  //     this.reqParams.end_pubdate = dateArr[1]
  //     // console.log(this.reqParams)
  //     this.$axios.get('articles', this.reqParams).then(res => {
  //       console.log(res)
  //     })
  //   }
  // }
}
</script>

<style scoped lang='less'></style>
