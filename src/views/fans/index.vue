<template>
  <div class="container-fans">
    <el-card>
      <div slot="header">
        <my-bread>粉丝管理</my-bread>
      </div>
      <!-- 标签页组件 -->
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="粉丝列表" name="fansList">
          <!-- 头像组件 -->
          <div class="fansList">
            <div class="fansInfo" v-for="item in fansList" :key="item.id.toString()">
              <el-avatar :size="80" :src="item.photo"></el-avatar>
              <p>{{item.name}}</p>
              <!-- 按钮组件 -->
              <el-button plain type="primary" size="small">+关注</el-button>
            </div>
          </div>
          <!-- 分页组件 -->
          <el-pagination
            background
            layout="prev, pager, next"
            @current-change="pager"
            :page-size="reqParams.per_page"
            :current-page="reqParams.page"
            :total="total"
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="粉丝图像" name="fansPicture">
          <!-- 准备dom容器具备高宽 -->
          <div ref="dom" style="width: 600px;height:400px;"></div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
// 引入echarts
import echarts from 'echarts'
export default {
  data () {
    return {
      activeName: 'fansList',
      fansList: [],
      reqParams: {
        page: 1,
        per_page: 27
      },
      total: 0
    }
  },
  created () {
    this.getFansList()
  },
  mounted () {
    // 通过ref属性获取dom元素
    const dom = this.$refs.dom
    // 初始化echarts
    const myEcharts = echarts.init(dom)
    // 配置及数据
    const option = {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '直接访问',
          type: 'bar',
          barWidth: '60%',
          data: [10, 52, 200, 334, 390, 330, 220]
        }
      ]
    }
    myEcharts.setOption(option)
  },
  methods: {
    // 获取粉丝列表
    async getFansList () {
      const { data: { data } } = await this.$axios.get('followers', { params: this.reqParams })
      this.fansList = data.results
      this.total = data.total_count
    },
    // 点击分页的函数
    pager (newPage) {
      this.reqParams.page = newPage
      this.getFansList()
    }
  }
}
</script>

<style scoped lang='less'>
.fansInfo {
  width: 150px;
  height: 190px;
  text-align: center;
  border: 1px solid #ccc;
  padding-top: 20px;
  margin: 0 20px 20px 0;
  display: inline-block;
}
</style>
